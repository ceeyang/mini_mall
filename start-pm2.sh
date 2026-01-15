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

# 1. 检查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装，请先安装 Node.js${NC}"
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
