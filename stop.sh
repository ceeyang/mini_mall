#!/bin/bash

# Mini Mall 停止脚本
# 停止所有运行中的服务

echo "🛑 停止 Mini Mall 服务..."

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 停止后端
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "停止后端服务 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
        rm -f .backend.pid
        echo "✅ 后端服务已停止"
    else
        rm -f .backend.pid
    fi
fi

# 停止前端
if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "停止前端服务 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
        rm -f .frontend.pid
        echo "✅ 前端服务已停止"
    else
        rm -f .frontend.pid
    fi
fi

# 清理可能残留的进程
pkill -f "nodemon.*backend" 2>/dev/null
pkill -f "serve.*frontend" 2>/dev/null

echo "✅ 所有服务已停止"
