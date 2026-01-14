#!/bin/bash

# MongoDB Docker 启动脚本
# 用于快速启动 MongoDB 容器

echo "🚀 启动 MongoDB..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    echo "   在应用程序中打开 Docker Desktop，等待其完全启动后再运行此脚本"
    exit 1
fi

# 检查容器是否已存在
if docker ps -a | grep -q "mongodb"; then
    echo "📦 发现已存在的 MongoDB 容器"
    
    # 检查容器是否正在运行
    if docker ps | grep -q "mongodb"; then
        echo "✅ MongoDB 已在运行中"
        echo "   连接地址: mongodb://localhost:27017/mini_mall"
    else
        echo "🔄 启动 MongoDB 容器..."
        docker start mongodb
        sleep 2
        
        if docker ps | grep -q "mongodb"; then
            echo "✅ MongoDB 启动成功！"
            echo "   连接地址: mongodb://localhost:27017/mini_mall"
        else
            echo "❌ MongoDB 启动失败，请查看日志:"
            docker logs mongodb
            exit 1
        fi
    fi
else
    echo "📦 创建新的 MongoDB 容器..."
    docker run -d \
      --name mongodb \
      -p 27017:27017 \
      -v mongodb_data:/data/db \
      mongo:latest
    
    sleep 2
    
    if docker ps | grep -q "mongodb"; then
        echo "✅ MongoDB 创建并启动成功！"
        echo "   连接地址: mongodb://localhost:27017/mini_mall"
        echo ""
        echo "💡 提示:"
        echo "   - 停止 MongoDB: docker stop mongodb"
        echo "   - 查看日志: docker logs mongodb"
        echo "   - 进入 MongoDB Shell: docker exec -it mongodb mongosh"
    else
        echo "❌ MongoDB 创建失败，请查看日志:"
        docker logs mongodb
        exit 1
    fi
fi

echo ""
echo "🎉 现在可以启动后端服务器了:"
echo "   cd backend && npm run dev"
