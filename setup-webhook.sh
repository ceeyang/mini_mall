#!/bin/bash

# GitHub Webhook 快速设置脚本

# 确保使用 bash 执行
if [ -z "$BASH_VERSION" ]; then
    exec /bin/bash "$0" "$@"
fi

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_msg() {
    local color=$1
    shift
    printf "${color}%s${NC}\n" "$@"
}

print_msg "$BLUE" "🚀 GitHub Webhook 快速设置"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    print_msg "$RED" "❌ Node.js 未安装"
    print_msg "$YELLOW" "请先安装 Node.js"
    exit 1
fi

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    print_msg "$YELLOW" "⚠️  PM2 未安装，将使用 node 直接运行"
    USE_PM2=false
else
    print_msg "$GREEN" "✅ PM2 已安装"
    USE_PM2=true
fi

# 读取配置
read -p "Webhook 端口 (默认: 3001): " WEBHOOK_PORT
WEBHOOK_PORT=${WEBHOOK_PORT:-3001}

read -p "Webhook 密钥 (默认: 随机生成): " WEBHOOK_SECRET
if [ -z "$WEBHOOK_SECRET" ]; then
    WEBHOOK_SECRET=$(openssl rand -hex 32)
    print_msg "$YELLOW" "生成的密钥: $WEBHOOK_SECRET"
fi

read -p "监听分支 (默认: main): " WEBHOOK_BRANCH
WEBHOOK_BRANCH=${WEBHOOK_BRANCH:-main}

REPO_PATH=$(pwd)

print_msg "$BLUE" ""
print_msg "$BLUE" "配置信息:"
print_msg "$BLUE" "  端口: $WEBHOOK_PORT"
print_msg "$BLUE" "  分支: $WEBHOOK_BRANCH"
print_msg "$BLUE" "  路径: $REPO_PATH"
print_msg "$BLUE" "  密钥: ${WEBHOOK_SECRET:0:20}..."
echo ""

# 更新 ecosystem-webhook.config.cjs
if [ -f "ecosystem-webhook.config.cjs" ]; then
    print_msg "$YELLOW" "更新 PM2 配置文件..."
    # 使用 sed 更新配置（简单方式）
    sed -i.bak "s/WEBHOOK_PORT: [0-9]*/WEBHOOK_PORT: $WEBHOOK_PORT/" ecosystem-webhook.config.cjs
    sed -i.bak "s/WEBHOOK_SECRET: \".*\"/WEBHOOK_SECRET: \"$WEBHOOK_SECRET\"/" ecosystem-webhook.config.cjs
    sed -i.bak "s/WEBHOOK_BRANCH: \".*\"/WEBHOOK_BRANCH: \"$WEBHOOK_BRANCH\"/" ecosystem-webhook.config.cjs
    rm -f ecosystem-webhook.config.cjs.bak
    print_msg "$GREEN" "✅ 配置文件已更新"
fi

# 创建日志目录
mkdir -p logs

# 启动服务
if [ "$USE_PM2" = true ]; then
    print_msg "$YELLOW" "使用 PM2 启动 Webhook 服务器..."
    
    # 设置环境变量
    export WEBHOOK_PORT=$WEBHOOK_PORT
    export WEBHOOK_SECRET=$WEBHOOK_SECRET
    export REPO_PATH=$REPO_PATH
    export WEBHOOK_BRANCH=$WEBHOOK_BRANCH
    
    # 停止旧进程（如果存在）
    pm2 delete github-webhook 2>/dev/null || true
    
    # 启动新进程
    pm2 start ecosystem-webhook.config.cjs
    pm2 save
    
    print_msg "$GREEN" "✅ Webhook 服务器已启动"
    print_msg "$BLUE" ""
    print_msg "$BLUE" "查看状态: pm2 status"
    print_msg "$BLUE" "查看日志: pm2 logs github-webhook"
    print_msg "$BLUE" "停止服务: pm2 stop github-webhook"
else
    print_msg "$YELLOW" "使用 node 启动 Webhook 服务器..."
    print_msg "$YELLOW" "提示: 按 Ctrl+C 停止服务"
    echo ""
    
    # 设置环境变量并启动
    export WEBHOOK_PORT=$WEBHOOK_PORT
    export WEBHOOK_SECRET=$WEBHOOK_SECRET
    export REPO_PATH=$REPO_PATH
    export WEBHOOK_BRANCH=$WEBHOOK_BRANCH
    
    node github-webhook-server.js
fi

echo ""
print_msg "$GREEN" "📝 下一步："
print_msg "$BLUE" "1. 在 GitHub 仓库设置中添加 Webhook:"
print_msg "$BLUE" "   URL: http://your-server-ip:$WEBHOOK_PORT/webhook"
print_msg "$BLUE" "   Secret: $WEBHOOK_SECRET"
print_msg "$BLUE" "   Content type: application/json"
print_msg "$BLUE" "   Events: Just the push event"
print_msg "$BLUE" ""
print_msg "$BLUE" "2. 测试: 向 $WEBHOOK_BRANCH 分支推送一个提交"
print_msg "$BLUE" ""
print_msg "$BLUE" "详细文档: doc/GITHUB_AUTO_DEPLOY.md"
