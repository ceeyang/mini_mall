#!/bin/bash

# Mini Mall 一键启动脚本
# 同时启动前端和后端服务

echo "🚀 启动 Mini Mall 项目..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装，请先安装 Node.js${NC}"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装，请先安装 npm${NC}"
    exit 1
fi

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查后端依赖
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 安装后端依赖...${NC}"
    cd backend
    npm install
    cd ..
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 安装前端依赖...${NC}"
    cd frontend
    npm install
    cd ..
fi

# 检查后端环境变量文件
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  后端环境变量文件不存在，从示例文件复制...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ 已创建 backend/.env 文件，请根据需要修改配置${NC}"
    else
        echo -e "${RED}❌ backend/.env.example 文件不存在${NC}"
    fi
fi

# 检查前端环境变量文件（可选）
if [ ! -f "frontend/.env" ]; then
    if [ -f "frontend/.env.example" ]; then
        echo -e "${YELLOW}💡 提示: 可以复制 frontend/.env.example 为 frontend/.env 来配置前端环境变量${NC}"
    fi
fi

# 检查 MongoDB（可选）
echo -e "${YELLOW}🔍 检查 MongoDB...${NC}"
if command -v docker &> /dev/null && docker ps | grep -q mongodb; then
    echo -e "${GREEN}✅ MongoDB 容器正在运行${NC}"
elif [ -f "backend/start-mongodb.sh" ]; then
    echo -e "${YELLOW}💡 提示: 如果 MongoDB 未运行，可以执行: ./backend/start-mongodb.sh${NC}"
fi

echo ""
echo -e "${GREEN}🎉 启动服务...${NC}"
echo ""

# 创建日志目录
mkdir -p logs

# 读取后端端口配置（从 backend/.env 或使用默认值）
BACKEND_PORT=8080
if [ -f "backend/.env" ]; then
    ENV_PORT=$(grep "^PORT=" backend/.env | cut -d '=' -f2 | tr -d '[:space:]')
    if [ ! -z "$ENV_PORT" ]; then
        BACKEND_PORT=$ENV_PORT
    fi
fi

# 读取前端端口配置（从 package.json 或使用默认值）
FRONTEND_PORT=3000
if [ -f "frontend/package.json" ]; then
    PKG_PORT=$(grep -o '"dev".*"-p [0-9]*"' frontend/package.json | grep -o '[0-9]*' | head -1)
    if [ ! -z "$PKG_PORT" ]; then
        FRONTEND_PORT=$PKG_PORT
    fi
fi

# 启动后端（后台运行）
echo -e "${GREEN}📡 启动后端服务 (http://localhost:${BACKEND_PORT})...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 检查后端是否启动成功
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ 后端服务已启动 (PID: $BACKEND_PID, 端口: ${BACKEND_PORT})${NC}"
else
    echo -e "${RED}❌ 后端服务启动失败，请查看 logs/backend.log${NC}"
    exit 1
fi

# 启动前端（后台运行）
echo -e "${GREEN}🌐 启动前端服务 (http://localhost:${FRONTEND_PORT})...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# 等待前端启动
sleep 2

# 检查前端是否启动成功
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ 前端服务已启动 (PID: $FRONTEND_PID, 端口: ${FRONTEND_PORT})${NC}"
else
    echo -e "${RED}❌ 前端服务启动失败，请查看 logs/frontend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Mini Mall 启动成功！${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "前端地址: ${GREEN}http://localhost:${FRONTEND_PORT}${NC}"
echo -e "后端 API: ${GREEN}http://localhost:${BACKEND_PORT}/api${NC}"
echo -e "健康检查: ${GREEN}http://localhost:${BACKEND_PORT}/health${NC}"
echo ""
echo -e "${YELLOW}💡 提示:${NC}"
echo -e "  - 查看后端日志: tail -f logs/backend.log"
echo -e "  - 查看前端日志: tail -f logs/frontend.log"
echo -e "  - 停止服务: ./stop.sh 或按 Ctrl+C"
echo ""
echo -e "${YELLOW}⚠️  注意: 关闭终端窗口会停止服务${NC}"
echo ""

# 保存 PID 到文件
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo '✅ 服务已停止'; exit 0" INT TERM

# 保持脚本运行
wait
