# Docker 部署指南

本文档说明如何使用 Docker 构建和部署 Mini Mall 后端服务。

## 📋 前置要求

- Docker 已安装（版本 20.10+）
- Docker Compose 已安装（可选，用于本地开发）

## 🚀 快速开始

### 方法一：使用 Docker Compose（推荐用于本地开发）

1. **配置环境变量**

   确保 `backend/.env` 文件已配置：

   ```env
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mini_mall
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:8080
   ```

2. **启动服务**

   ```bash
   cd backend
   docker-compose up -d
   ```

3. **查看日志**

   ```bash
   docker-compose logs -f
   ```

4. **停止服务**

   ```bash
   docker-compose down
   ```

### 方法二：使用 Docker 命令

1. **构建镜像**

   ```bash
   cd backend
   docker build -t mini-mall-backend:latest .
   ```

2. **运行容器**

   ```bash
   docker run -d \
     --name mini-mall-backend \
     -p 3000:3000 \
     -e MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/mini_mall" \
     -e JWT_SECRET="your-secret-key" \
     -e FRONTEND_URL="http://localhost:8080" \
     --env-file .env \
     --restart unless-stopped \
     mini-mall-backend:latest
   ```

3. **查看日志**

   ```bash
   docker logs -f mini-mall-backend
   ```

4. **停止容器**

   ```bash
   docker stop mini-mall-backend
   docker rm mini-mall-backend
   ```

## 🔧 环境变量配置

### 必需的环境变量

- `MONGODB_URI`: MongoDB 连接字符串
- `JWT_SECRET`: JWT 密钥

### 可选的环境变量

- `PORT`: 服务端口（默认: 3000）
- `NODE_ENV`: 运行环境（默认: production）
- `JWT_EXPIRES_IN`: JWT 过期时间（默认: 7d）
- `FRONTEND_URL`: 前端地址（用于 CORS）
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID（可选）
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret（可选）
- `GOOGLE_CALLBACK_URL`: Google OAuth 回调地址（可选）

## 📦 构建优化

### 多阶段构建（可选）

如果需要更小的镜像，可以使用多阶段构建：

```dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 生产阶段
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER nodejs
EXPOSE 3000
CMD ["node", "src/server.js"]
```

## 🐳 Docker Hub 部署

### 1. 构建并标记镜像

```bash
docker build -t your-username/mini-mall-backend:latest .
docker tag mini-mall-backend:latest your-username/mini-mall-backend:v1.0.0
```

### 2. 推送到 Docker Hub

```bash
docker login
docker push your-username/mini-mall-backend:latest
docker push your-username/mini-mall-backend:v1.0.0
```

### 3. 从 Docker Hub 拉取并运行

```bash
docker pull your-username/mini-mall-backend:latest
docker run -d \
  --name mini-mall-backend \
  -p 3000:3000 \
  --env-file .env \
  your-username/mini-mall-backend:latest
```

## ☁️ 云平台部署

### Railway

1. 连接 GitHub 仓库
2. 设置环境变量
3. Railway 会自动检测 Dockerfile 并构建

### Render

1. 创建新的 Web Service
2. 连接 GitHub 仓库
3. 设置构建命令：`docker build -t mini-mall-backend .`
4. 设置启动命令：`docker run -p $PORT:3000 mini-mall-backend`
5. 配置环境变量

### AWS ECS / Google Cloud Run / Azure Container Instances

参考各平台的容器部署文档，使用构建好的 Docker 镜像。

## 🔍 健康检查

容器包含健康检查，可以通过以下方式验证：

```bash
# 检查容器健康状态
docker ps

# 手动检查健康端点
curl http://localhost:3000/health
```

## 📝 日志管理

### 查看实时日志

```bash
docker logs -f mini-mall-backend
```

### 查看最近日志

```bash
docker logs --tail 100 mini-mall-backend
```

### 导出日志

```bash
docker logs mini-mall-backend > backend.log
```

## 🔒 安全最佳实践

1. **使用非 root 用户运行**：Dockerfile 已配置
2. **不要将敏感信息写入镜像**：使用环境变量或 secrets
3. **定期更新基础镜像**：保持 Node.js 版本最新
4. **扫描镜像漏洞**：
   ```bash
   docker scan mini-mall-backend:latest
   ```

## 🐛 故障排查

### 容器无法启动

1. 检查日志：
   ```bash
   docker logs mini-mall-backend
   ```

2. 检查环境变量：
   ```bash
   docker exec mini-mall-backend env
   ```

3. 检查端口占用：
   ```bash
   lsof -i :3000
   ```

### 数据库连接失败

1. 检查 `MONGODB_URI` 环境变量
2. 确保 MongoDB 允许容器 IP 访问
3. 检查网络连接

### 健康检查失败

1. 检查应用是否正常启动
2. 检查 `/health` 端点是否可访问
3. 查看应用日志

## 📚 相关文档

- [Docker 官方文档](https://docs.docker.com/)
- [Node.js Docker 最佳实践](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [部署指南](../doc/DEPLOY_GUIDE.md)
