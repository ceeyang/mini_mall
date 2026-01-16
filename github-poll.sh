#!/bin/bash

# GitHub 轮询检查脚本
# 定期检查 GitHub 仓库是否有新提交，如果有则自动拉取并重新构建
# 
# 使用方法：
# 1. 配置下面的变量
# 2. 运行: ./github-poll.sh
# 3. 或者使用 systemd/cron 定期运行

# 确保使用 bash 执行
if [ -z "$BASH_VERSION" ]; then
    exec /bin/bash "$0" "$@"
fi

# 配置
REPO_PATH="${REPO_PATH:-$(pwd)}"
BRANCH="${GITHUB_BRANCH:-main}"  # 或 master
REMOTE="${GITHUB_REMOTE:-origin}"
CHECK_INTERVAL="${CHECK_INTERVAL:-60}"  # 检查间隔（秒）
LOG_FILE="${LOG_FILE:-$REPO_PATH/github-poll.log}"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# 打印带颜色的消息
print_msg() {
    local color=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    printf "${color}[%s] %s${NC}\n" "$timestamp" "$message" | tee -a "$LOG_FILE"
}

# 获取当前本地提交哈希
get_local_hash() {
    cd "$REPO_PATH" || exit 1
    git rev-parse HEAD 2>/dev/null
}

# 获取远程提交哈希
get_remote_hash() {
    cd "$REPO_PATH" || exit 1
    git ls-remote "$REMOTE" "$BRANCH" 2>/dev/null | awk '{print $1}'
}

# 检查是否有新提交
check_for_updates() {
    print_msg "$BLUE" "🔍 检查更新..."
    
    # 获取远程最新提交
    local remote_hash=$(get_remote_hash)
    if [ -z "$remote_hash" ]; then
        print_msg "$RED" "❌ 无法获取远程提交信息"
        return 1
    fi
    
    # 获取本地提交
    local local_hash=$(get_local_hash)
    if [ -z "$local_hash" ]; then
        print_msg "$RED" "❌ 无法获取本地提交信息"
        return 1
    fi
    
    # 比较
    if [ "$remote_hash" != "$local_hash" ]; then
        print_msg "$YELLOW" "📬 发现新提交！"
        print_msg "$YELLOW" "   本地: ${local_hash:0:7}"
        print_msg "$YELLOW" "   远程: ${remote_hash:0:7}"
        return 0
    else
        print_msg "$GREEN" "✅ 已是最新版本"
        return 1
    fi
}

# 部署流程
deploy() {
    print_msg "$BLUE" "🚀 开始自动部署..."
    
    cd "$REPO_PATH" || exit 1
    
    # 1. 拉取最新代码
    print_msg "$YELLOW" "📥 拉取最新代码..."
    if ! git fetch "$REMOTE" "$BRANCH"; then
        print_msg "$RED" "❌ 拉取代码失败"
        return 1
    fi
    
    # 2. 重置到远程分支
    if ! git reset --hard "$REMOTE/$BRANCH"; then
        print_msg "$RED" "❌ 重置代码失败"
        return 1
    fi
    
    # 3. 检查是否有 PM2
    if command -v pm2 &> /dev/null; then
        # 4. 安装依赖
        print_msg "$YELLOW" "📦 安装后端依赖..."
        if [ -d "backend" ]; then
            cd backend
            if ! npm install --production; then
                print_msg "$RED" "❌ 后端依赖安装失败"
                cd "$REPO_PATH"
                return 1
            fi
            cd "$REPO_PATH"
        fi
        
        print_msg "$YELLOW" "📦 安装前端依赖..."
        if [ -d "frontend" ]; then
            cd frontend
            if ! npm install; then
                print_msg "$RED" "❌ 前端依赖安装失败"
                cd "$REPO_PATH"
                return 1
            fi
            cd "$REPO_PATH"
        fi
        
        # 5. 重启 PM2 服务
        print_msg "$YELLOW" "🔄 重启 PM2 服务..."
        if pm2 restart all; then
            pm2 save
            print_msg "$GREEN" "✅ 部署完成！"
        else
            print_msg "$RED" "❌ PM2 重启失败"
            return 1
        fi
    else
        print_msg "$YELLOW" "⚠️  PM2 未安装，跳过 PM2 重启步骤"
        print_msg "$YELLOW" "💡 提示: 运行 ./start-pm2.sh 来启动服务"
    fi
    
    return 0
}

# 主循环
main_loop() {
    print_msg "$GREEN" "🚀 GitHub 轮询检查已启动"
    print_msg "$BLUE" "📁 仓库路径: $REPO_PATH"
    print_msg "$BLUE" "🌿 监听分支: $BRANCH"
    print_msg "$BLUE" "⏱️  检查间隔: ${CHECK_INTERVAL}秒"
    print_msg "$BLUE" "📝 日志文件: $LOG_FILE"
    print_msg "" ""
    
    while true; do
        if check_for_updates; then
            deploy
        fi
        
        sleep "$CHECK_INTERVAL"
    done
}

# 单次检查模式
single_check() {
    print_msg "$GREEN" "🔍 执行单次检查..."
    if check_for_updates; then
        deploy
    fi
}

# 显示帮助信息
show_help() {
    cat << EOF
GitHub 轮询检查脚本

用法:
    $0 [选项]

选项:
    -h, --help          显示帮助信息
    -s, --single        执行单次检查后退出
    -d, --daemon        后台运行（默认）
    -p, --path PATH     指定仓库路径（默认: 当前目录）
    -b, --branch BRANCH 指定分支（默认: main）
    -i, --interval SEC  检查间隔秒数（默认: 60）
    -l, --log FILE      日志文件路径

环境变量:
    REPO_PATH          仓库路径
    GITHUB_BRANCH       监听的分支
    GITHUB_REMOTE       远程仓库名称（默认: origin）
    CHECK_INTERVAL      检查间隔（秒）

示例:
    # 后台运行，每60秒检查一次
    $0

    # 单次检查
    $0 --single

    # 指定路径和分支，每30秒检查一次
    $0 --path /path/to/repo --branch main --interval 30

    # 使用环境变量
    REPO_PATH=/path/to/repo GITHUB_BRANCH=main $0
EOF
}

# 解析命令行参数
MODE="daemon"

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--single)
            MODE="single"
            shift
            ;;
        -d|--daemon)
            MODE="daemon"
            shift
            ;;
        -p|--path)
            REPO_PATH="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -i|--interval)
            CHECK_INTERVAL="$2"
            shift 2
            ;;
        -l|--log)
            LOG_FILE="$2"
            shift 2
            ;;
        *)
            print_msg "$RED" "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
done

# 检查是否在 git 仓库中
if [ ! -d "$REPO_PATH/.git" ]; then
    print_msg "$RED" "❌ 错误: $REPO_PATH 不是 git 仓库"
    exit 1
fi

# 检查 git 命令
if ! command -v git &> /dev/null; then
    print_msg "$RED" "❌ 错误: git 未安装"
    exit 1
fi

# 根据模式运行
if [ "$MODE" = "single" ]; then
    single_check
else
    main_loop
fi
