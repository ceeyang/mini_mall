#!/bin/bash

# Mini Mall PM2 一键启动脚本
# 适用于生产环境部署

echo "🚀 开始 Mini Mall PM2 部署..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color


# 0. 尝试加载环境变量 (解决 NVM 或自定义路径找不到 Node 的问题)
# 加载 .bashrc 和 .profile (针对 Ubuntu 等 Linux 发行版)
if [ -f "$HOME/.bashrc" ]; then
    # 避免在此脚本中执行 .bashrc 中的交互式命令导致的问题，通常 .bashrc 会有 check
    # 但为了保险，我们只尝试加载 NVM 相关的
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
elif [ -f "$HOME/.profile" ]; then
    # source "$HOME/.profile" # profile 可能会打印东西，暂时只加 NVM
    true
fi

# 再次明确检查 NVM 默认路径
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 增加常用系统路径（Ubuntu apt-get 安装的 Node.js 通常在 /usr/bin）
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin

# 1. 检查 Node.js 和 npm
# Ubuntu 使用 apt-get 安装时，可执行文件可能是 nodejs 而不是 node
NODE_CMD=""
if command -v node &> /dev/null; then
    NODE_CMD="node"
elif command -v nodejs &> /dev/null; then
    NODE_CMD="nodejs"
    echo -e "${YELLOW}⚠️  检测到 nodejs 命令，但未找到 node 命令${NC}"
    echo -e "${YELLOW}   建议运行: sudo ln -s /usr/bin/nodejs /usr/bin/node${NC}"
    echo -e "${YELLOW}   或者使用 nodejs 命令（脚本将尝试使用 nodejs）${NC}"
else
    echo -e "${RED}❌ Node.js 未安装或未在 PATH 中找到${NC}"
    echo -e "当前 PATH: $PATH"
    echo -e "已检查的路径:"
    echo -e "  - /usr/bin/node: $([ -f /usr/bin/node ] && echo '存在' || echo '不存在')"
    echo -e "  - /usr/bin/nodejs: $([ -f /usr/bin/nodejs ] && echo '存在' || echo '不存在')"
    echo -e "  - /usr/local/bin/node: $([ -f /usr/local/bin/node ] && echo '存在' || echo '不存在')"
    echo -e "建议："
    echo -e "  1. 如果是 NVM 安装，请确保 NVM 环境变量被正确加载"
    echo -e "  2. 如果是 apt-get 安装，请确保已安装 nodejs 包: sudo apt-get install nodejs npm"
    echo -e "  3. 如果已安装但找不到，请检查 PATH 环境变量"
    exit 1
fi

# 验证 Node.js 版本
NODE_VERSION=$($NODE_CMD --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 检测到 Node.js: $NODE_VERSION (使用命令: $NODE_CMD)${NC}"
else
    echo -e "${RED}❌ 无法获取 Node.js 版本信息${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装，请先安装 npm${NC}"
    exit 1
fi

# 2. 全局安装 PM2 (如果未安装)
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⬇️  正在安装 PM2...${NC}"
    npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 已安装${NC}"
fi

# 3. 安装后端依赖
echo -e "${YELLOW}📦 安装后端依赖...${NC}"
if [ -d "backend" ]; then
    cd backend
    npm install --production
    # 检查并创建 .env
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        echo -e "${YELLOW}⚠️  创建后端 .env 文件...${NC}"
        cp .env.example .env
    fi
    cd ..
else
    echo -e "${RED}❌ backend 目录不存在${NC}"
    exit 1
fi

# 4. 安装前端依赖 (主要是 serve)
echo -e "${YELLOW}📦 安装前端依赖...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    # 即使是静态站点，我们也需要安装 serve 或其他工具如果 package.json 里面有定义
    npm install
    # 检查并创建 .env
    if [ ! -f ".env" ] && [ -f ".env.example" ]; then
        echo -e "${YELLOW}⚠️  创建前端 .env 文件...${NC}"
        cp .env.example .env
    fi
    cd ..
else
    echo -e "${RED}❌ frontend 目录不存在${NC}"
    exit 1
fi

# 5. 使用 PM2 启动
echo -e "${GREEN}🚀 使用 PM2 启动服务...${NC}"
pm2 start ecosystem.config.cjs

# 6. 保存 PM2 列表 (确保重启后自动恢复)
echo -e "${YELLOW}💾 保存 PM2 进程列表...${NC}"
pm2 save

echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "前端运行在: http://localhost:8080"
echo -e "后端运行在: http://localhost:3000/api"
echo ""
echo -e "常用 PM2 命令:"
echo -e "  pm2 list        # 查看进程状态"
echo -e "  pm2 logs        # 查看日志"
echo -e "  pm2 stop all    # 停止所有服务"
echo -e "  pm2 restart all # 重启所有服务"
