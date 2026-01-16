#!/bin/bash

# Mini Mall PM2 一键启动脚本
# 适用于生产环境部署，兼容 Ubuntu 和 macOS

# 确保使用 bash 执行
if [ -z "$BASH_VERSION" ]; then
    exec /bin/bash "$0" "$@"
fi

echo "🚀 开始 Mini Mall PM2 部署..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_msg() {
    local color=$1
    shift
    printf "${color}%s${NC}\n" "$@"
}

# 检测操作系统
detect_os() {
    local os_type="${OSTYPE:-unknown}"
    
    case "$os_type" in
        linux-gnu*)
            # 检测 Linux 发行版
            if [ -f /etc/os-release ]; then
                . /etc/os-release
                OS="$ID"
            else
                OS="linux"
            fi
            ;;
        darwin*)
            OS="macos"
            ;;
        *)
            # 尝试通过 uname 检测
            case "$(uname -s)" in
                Linux)
                    if [ -f /etc/os-release ]; then
                        . /etc/os-release
                        OS="$ID"
                    else
                        OS="linux"
                    fi
                    ;;
                Darwin)
                    OS="macos"
                    ;;
                *)
                    OS="unknown"
                    ;;
            esac
            ;;
    esac
    echo "$OS"
}

OS=$(detect_os)
print_msg "$BLUE" "📱 检测到操作系统: $OS"

# 检查是否有 sudo 权限（Linux 需要）
check_sudo() {
    if [ "$OS" != "macos" ]; then
        if ! sudo -n true 2>/dev/null; then
            print_msg "$YELLOW" "⚠️  需要 sudo 权限来安装系统包，请输入密码"
            sudo -v
        fi
    fi
}

# 检查并安装命令（Ubuntu/Debian）
install_command_ubuntu() {
    local cmd=$1
    local package=$2
    
    if ! command -v "$cmd" &> /dev/null; then
        print_msg "$YELLOW" "⬇️  正在安装 $package (Ubuntu/Debian)..."
        check_sudo
        sudo apt-get update -qq
        sudo apt-get install -y "$package"
    else
        print_msg "$GREEN" "✅ $cmd 已安装"
    fi
}

# 检查并安装命令（macOS）
install_command_macos() {
    local cmd=$1
    local package=$2
    
    if ! command -v "$cmd" &> /dev/null; then
        print_msg "$YELLOW" "⬇️  正在安装 $package (macOS)..."
        
        # 检查是否有 Homebrew
        if ! command -v brew &> /dev/null; then
            print_msg "$YELLOW" "📦 检测到 Homebrew 未安装，正在安装 Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            
            # 添加 Homebrew 到 PATH（针对 Apple Silicon Mac）
            if [ -f "/opt/homebrew/bin/brew" ]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            elif [ -f "/usr/local/bin/brew" ]; then
                eval "$(/usr/local/bin/brew shellenv)"
            fi
        fi
        
        brew install "$package"
    else
        print_msg "$GREEN" "✅ $cmd 已安装"
    fi
}

# 加载环境变量（解决 NVM 或自定义路径找不到 Node 的问题）
load_environment() {
    # 加载 .bashrc 和 .profile (针对 Ubuntu 等 Linux 发行版)
    if [ -f "$HOME/.bashrc" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
    fi
    
    # 再次明确检查 NVM 默认路径
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 2>/dev/null || true
    
    # 增加常用系统路径
    export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:$PATH
}

load_environment

# 1. 检查并安装 Node.js 和 npm
install_nodejs() {
    NODE_CMD=""
    
    # 首先尝试通过 command -v 查找
    if command -v node &> /dev/null 2>&1; then
        NODE_CMD="node"
    elif command -v nodejs &> /dev/null 2>&1; then
        NODE_CMD="nodejs"
        print_msg "$YELLOW" "⚠️  检测到 nodejs 命令，但未找到 node 命令"
        # 尝试创建软链接（需要权限）
        if [ -x "/usr/bin/nodejs" ] && [ ! -f "/usr/bin/node" ]; then
            print_msg "$YELLOW" "   正在创建 node 软链接..."
            if sudo ln -sf /usr/bin/nodejs /usr/bin/node 2>/dev/null; then
                NODE_CMD="node"
                print_msg "$GREEN" "✅ 已创建 node 软链接"
            fi
        fi
    elif [ -x "/usr/bin/nodejs" ]; then
        NODE_CMD="/usr/bin/nodejs"
        export PATH="/usr/bin:$PATH"
    elif [ -x "/usr/bin/node" ]; then
        NODE_CMD="/usr/bin/node"
        export PATH="/usr/bin:$PATH"
    elif [ -x "/usr/local/bin/node" ]; then
        NODE_CMD="/usr/local/bin/node"
        export PATH="/usr/local/bin:$PATH"
    elif [ -x "/opt/homebrew/bin/node" ]; then
        NODE_CMD="/opt/homebrew/bin/node"
        export PATH="/opt/homebrew/bin:$PATH"
    else
        # 未找到 Node.js，尝试安装
        print_msg "$YELLOW" "📦 Node.js 未安装，正在自动安装..."
        
        if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
            check_sudo
            sudo apt-get update -qq
            sudo apt-get install -y nodejs npm
            # 重新加载环境
            load_environment
            # 再次检查
            if command -v nodejs &> /dev/null 2>&1; then
                NODE_CMD="nodejs"
                # 创建软链接
                if [ -x "/usr/bin/nodejs" ] && [ ! -f "/usr/bin/node" ]; then
                    sudo ln -sf /usr/bin/nodejs /usr/bin/node
                    NODE_CMD="node"
                fi
            elif command -v node &> /dev/null 2>&1; then
                NODE_CMD="node"
            else
                print_msg "$RED" "❌ Node.js 安装失败，请手动安装"
                exit 1
            fi
        elif [ "$OS" = "macos" ]; then
            # macOS 使用 Homebrew 安装
            if ! command -v brew &> /dev/null; then
                print_msg "$YELLOW" "📦 正在安装 Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                
                # 添加 Homebrew 到 PATH
                if [ -f "/opt/homebrew/bin/brew" ]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [ -f "/usr/local/bin/brew" ]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi
            fi
            
            brew install node
            load_environment
            
            if command -v node &> /dev/null 2>&1; then
                NODE_CMD="node"
            else
                print_msg "$RED" "❌ Node.js 安装失败，请手动安装"
                exit 1
            fi
        else
            print_msg "$RED" "❌ 无法自动安装 Node.js，请手动安装"
            printf "Ubuntu/Debian: sudo apt-get install nodejs npm\n"
            printf "macOS: brew install node\n"
            exit 1
        fi
    fi
    
    # 验证 Node.js 版本
    NODE_VERSION=$($NODE_CMD --version 2>/dev/null || echo "unknown")
    if [ "$NODE_VERSION" != "unknown" ]; then
        print_msg "$GREEN" "✅ 检测到 Node.js: $NODE_VERSION (使用命令: $NODE_CMD)"
    else
        print_msg "$RED" "❌ 无法获取 Node.js 版本信息"
        exit 1
    fi
}

install_nodejs

# 2. 检查并安装 npm
install_npm() {
    NPM_CMD=""
    
    if command -v npm &> /dev/null 2>&1; then
        NPM_CMD="npm"
    elif [ -x "/usr/bin/npm" ]; then
        NPM_CMD="/usr/bin/npm"
        export PATH="/usr/bin:$PATH"
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        fi
    elif [ -x "/usr/local/bin/npm" ]; then
        NPM_CMD="/usr/local/bin/npm"
        export PATH="/usr/local/bin:$PATH"
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        fi
    elif [ -x "/opt/homebrew/bin/npm" ]; then
        NPM_CMD="/opt/homebrew/bin/npm"
        export PATH="/opt/homebrew/bin:$PATH"
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        fi
    else
        # npm 通常随 Node.js 一起安装，如果找不到，可能是安装不完整
        print_msg "$RED" "❌ npm 未找到，但 Node.js 已安装"
        print_msg "$YELLOW" "   尝试重新安装 Node.js 和 npm..."
        
        if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
            check_sudo
            sudo apt-get install -y --reinstall nodejs npm
            load_environment
        elif [ "$OS" = "macos" ]; then
            brew reinstall node
            load_environment
        fi
        
        if command -v npm &> /dev/null 2>&1; then
            NPM_CMD="npm"
        else
            print_msg "$RED" "❌ npm 安装失败，请手动安装"
            exit 1
        fi
    fi
    
    # 验证 npm 版本
    NPM_VERSION=$(npm --version 2>/dev/null || echo "unknown")
    if [ "$NPM_VERSION" != "unknown" ]; then
        print_msg "$GREEN" "✅ 检测到 npm: $NPM_VERSION"
    else
        print_msg "$RED" "❌ 无法获取 npm 版本信息"
        exit 1
    fi
}

install_npm

# 3. 检查并安装 PM2
install_pm2() {
    if ! command -v pm2 &> /dev/null 2>&1; then
        print_msg "$YELLOW" "⬇️  正在全局安装 PM2..."
        npm install -g pm2
        
        # 验证安装
        if command -v pm2 &> /dev/null 2>&1; then
            print_msg "$GREEN" "✅ PM2 安装成功"
        else
            # 如果还是找不到，可能需要添加到 PATH
            if [ -d "$HOME/.npm-global/bin" ]; then
                export PATH="$HOME/.npm-global/bin:$PATH"
                if command -v pm2 &> /dev/null 2>&1; then
                    print_msg "$GREEN" "✅ PM2 安装成功（已添加到 PATH）"
                else
                    print_msg "$RED" "❌ PM2 安装失败"
                    exit 1
                fi
            else
                print_msg "$RED" "❌ PM2 安装失败"
                exit 1
            fi
        fi
    else
        print_msg "$GREEN" "✅ PM2 已安装"
    fi
}

install_pm2

# 4. 安装后端依赖
print_msg "$YELLOW" "📦 安装后端依赖..."
if [ -d "backend" ]; then
    cd backend
    if npm install --production; then
        print_msg "$GREEN" "✅ 后端依赖安装成功"
    else
        print_msg "$RED" "❌ 后端依赖安装失败"
        cd ..
        exit 1
    fi
    # 检查并创建 .env
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        print_msg "$YELLOW" "⚠️  创建后端 .env 文件..."
        cp .env.example .env
    fi
    cd ..
else
    print_msg "$RED" "❌ backend 目录不存在"
    exit 1
fi

# 5. 安装前端依赖
print_msg "$YELLOW" "📦 安装前端依赖..."
if [ -d "frontend" ]; then
    cd frontend
    if npm install; then
        print_msg "$GREEN" "✅ 前端依赖安装成功"
    else
        print_msg "$RED" "❌ 前端依赖安装失败"
        cd ..
        exit 1
    fi
    # 检查并创建 .env
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        print_msg "$YELLOW" "⚠️  创建前端 .env 文件..."
        cp .env.example .env
    fi
    cd ..
else
    print_msg "$RED" "❌ frontend 目录不存在"
    exit 1
fi

# 6. 使用 PM2 启动
print_msg "$GREEN" "🚀 使用 PM2 启动服务..."
if [ -f "ecosystem.config.cjs" ]; then
    if pm2 start ecosystem.config.cjs; then
        print_msg "$GREEN" "✅ PM2 启动成功"
    else
        print_msg "$RED" "❌ PM2 启动失败"
        exit 1
    fi
else
    print_msg "$RED" "❌ ecosystem.config.cjs 文件不存在"
    exit 1
fi

# 7. 保存 PM2 列表 (确保重启后自动恢复)
print_msg "$YELLOW" "💾 保存 PM2 进程列表..."
if pm2 save; then
    print_msg "$GREEN" "✅ PM2 进程列表已保存"
else
    print_msg "$YELLOW" "⚠️  PM2 进程列表保存失败（可能没有权限）"
fi

echo ""
print_msg "$GREEN" "🎉 部署完成！"
printf "前端运行在: http://localhost:3000\n"
printf "后端运行在: http://localhost:8080/api\n"
echo ""
printf "常用 PM2 命令:\n"
printf "  pm2 list        # 查看进程状态\n"
printf "  pm2 logs        # 查看日志\n"
printf "  pm2 stop all    # 停止所有服务\n"
printf "  pm2 restart all # 重启所有服务\n"
printf "  pm2 delete all  # 删除所有进程\n"
