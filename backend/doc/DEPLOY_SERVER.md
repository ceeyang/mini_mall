# 服务端 Docker 部署指南

本文档说明如何在服务器上拉取并部署 Mini Mall 后端 Docker 镜像。

## 📋 前置要求

- 服务器已安装 Docker
- 服务器可以访问互联网（用于拉取镜像）
- 已准备好环境变量配置

## 🚀 快速部署

### 步骤 1: 拉取镜像

```bash
docker pull ceeyang/mini-mall-backend:latest
```

### 步骤 2: 创建环境变量文件

在服务器上创建 `.env` 文件：

```bash
# 创建目录（如果不存在）
mkdir -p /opt/mini-mall-backend
cd /opt/mini-mall-backend

# 创建 .env 文件
cat > .env << EOF
PORT=7891
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mini_mall
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
EOF
```

### 步骤 3: 运行容器

```bash
docker run -d \
  --name mini-mall-backend \
  --restart unless-stopped \
  -p 7891:7891 \
  --env-file .env \
  ceeyang/mini-mall-backend:latest
```

## 📝 完整部署脚本

创建部署脚本 `deploy.sh`：

```bash
#!/bin/bash

# Mini Mall Backend 部署脚本

set -e

IMAGE_NAME="ceeyang/mini-mall-backend:latest"
CONTAINER_NAME="mini-mall-backend"
PORT=7891
ENV_FILE=".env"

echo "🚀 开始部署 Mini Mall Backend..."

# 1. 拉取最新镜像
echo "📦 拉取最新镜像..."
docker pull $IMAGE_NAME

# 2. 停止并删除旧容器（如果存在）
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 停止旧容器..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# 3. 检查环境变量文件
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  环境变量文件 $ENV_FILE 不存在"
    echo "请创建 $ENV_FILE 文件并配置必要的环境变量"
    exit 1
fi

# 4. 运行新容器
echo "▶️  启动新容器..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:$PORT \
  --env-file $ENV_FILE \
  $IMAGE_NAME

# 5. 等待容器启动
echo "⏳ 等待容器启动..."
sleep 5

# 6. 检查容器状态
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "✅ 容器启动成功！"
    echo ""
    echo "📊 容器信息："
    docker ps -f name=$CONTAINER_NAME
    echo ""
    echo "📝 查看日志："
    echo "   docker logs -f $CONTAINER_NAME"
    echo ""
    echo "🔍 健康检查："
    echo "   curl http://localhost:$PORT/health"
else
    echo "❌ 容器启动失败，查看日志："
    docker logs $CONTAINER_NAME
    exit 1
fi
```

使用部署脚本：

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔧 常用管理命令

### 查看容器状态

```bash
docker ps -f name=mini-mall-backend
```

### 查看日志

```bash
# 实时查看日志
docker logs -f mini-mall-backend

# 查看最近 100 行日志
docker logs --tail 100 mini-mall-backend

# 查看最近 1 小时的日志
docker logs --since 1h mini-mall-backend
```

### 停止容器

```bash
docker stop mini-mall-backend
```

### 启动容器

```bash
docker start mini-mall-backend
```

### 重启容器

```bash
docker restart mini-mall-backend
```

### 删除容器

```bash
# 先停止容器
docker stop mini-mall-backend

# 删除容器
docker rm mini-mall-backend
```

### 更新镜像并重新部署

```bash
# 1. 拉取最新镜像
docker pull ceeyang/mini-mall-backend:latest

# 2. 停止并删除旧容器
docker stop mini-mall-backend
docker rm mini-mall-backend

# 3. 运行新容器
docker run -d \
  --name mini-mall-backend \
  --restart unless-stopped \
  -p 7891:7891 \
  --env-file .env \
  ceeyang/mini-mall-backend:latest
```

## 🔍 健康检查

### 检查容器健康状态

```bash
docker ps
# 查看 HEALTH STATUS 列

# 或使用健康检查端点
curl http://localhost:7891/health
```

### 进入容器调试

```bash
docker exec -it mini-mall-backend sh
```

## 🔐 安全配置

### 使用 Docker Secrets（生产环境推荐）

```bash
# 创建 secret
echo "your-secret-value" | docker secret create jwt_secret -

# 运行容器时使用 secret
docker run -d \
  --name mini-mall-backend \
  --restart unless-stopped \
  -p 7891:7891 \
  --secret jwt_secret \
  -e JWT_SECRET_FILE=/run/secrets/jwt_secret \
  ceeyang/mini-mall-backend:latest
```

### 限制资源使用

```bash
docker run -d \
  --name mini-mall-backend \
  --restart unless-stopped \
  -p 7891:7891 \
  --env-file .env \
  --memory="512m" \
  --cpus="1.0" \
  ceeyang/mini-mall-backend:latest
```

## 🌐 使用 Nginx 反向代理

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:7891;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 监控和日志

### 查看容器资源使用

```bash
docker stats mini-mall-backend
```

### 导出日志

```bash
# 导出到文件
docker logs mini-mall-backend > backend.log 2>&1

# 导出最近 1 小时的日志
docker logs --since 1h mini-mall-backend > backend-recent.log 2>&1
```

### 使用 Docker Compose（可选）

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  backend:
    image: ceeyang/mini-mall-backend:latest
    container_name: mini-mall-backend
    ports:
      - "7891:7891"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:7891/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s
```

使用 Docker Compose：

```bash
# 启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down

# 更新并重启
docker-compose pull
docker-compose up -d
```

## 🐛 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker logs mini-mall-backend

# 检查容器状态
docker ps -a | grep mini-mall-backend

# 检查端口占用
netstat -tulpn | grep 7891
# 或
lsof -i :7891
```

### 数据库连接失败

```bash
# 检查环境变量
docker exec mini-mall-backend env | grep MONGODB_URI

# 测试网络连接
docker exec mini-mall-backend ping -c 3 cluster.mongodb.net
```

### 健康检查失败

```bash
# 手动检查健康端点
curl http://localhost:7891/health

# 查看应用日志
docker logs mini-mall-backend | tail -50
```

## 🔄 自动化部署

### 使用 Cron 定时更新

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天凌晨 2 点检查更新）
0 2 * * * cd /opt/mini-mall-backend && docker pull ceeyang/mini-mall-backend:latest && docker-compose up -d
```

### 使用 Watchtower 自动更新

```bash
# 安装 Watchtower
docker run -d \
  --name watchtower \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 3600 \
  mini-mall-backend
```

## 📚 相关文档

- [Docker 部署文档](./DOCKER.md)
- [Docker 镜像共享指南](./DOCKER_SHARE.md)
- [端口配置指南](./PORT_CONFIG.md)
- [完整部署指南](../../doc/DEPLOY_GUIDE.md)
