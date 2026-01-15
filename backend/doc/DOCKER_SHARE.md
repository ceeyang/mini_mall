# Docker 镜像共享指南

本文档说明如何将构建好的 Docker 镜像共享给他人或部署到其他环境。

## 📦 方法一：推送到 Docker Hub（推荐）

Docker Hub 是最常用的公共容器注册表，免费且易于使用。

### 步骤 1: 注册 Docker Hub 账号

1. 访问 [Docker Hub](https://hub.docker.com/)
2. 注册账号（如果还没有）

### 步骤 2: 登录 Docker Hub

```bash
docker login
# 输入你的 Docker Hub 用户名和密码
```

### 步骤 3: 标记镜像

```bash
cd backend
docker tag mini-mall-backend:latest your-username/mini-mall-backend:latest
docker tag mini-mall-backend:latest your-username/mini-mall-backend:v1.0.0
```

**说明：**
- `your-username` 替换为你的 Docker Hub 用户名
- `latest` 是最新版本标签
- `v1.0.0` 是版本号标签（建议使用语义化版本）

### 步骤 4: 推送镜像

```bash
# 推送 latest 标签
docker push your-username/mini-mall-backend:latest

# 推送版本标签
docker push your-username/mini-mall-backend:v1.0.0
```

### 步骤 5: 其他人拉取镜像

```bash
docker pull your-username/mini-mall-backend:latest
docker run -d \
  --name mini-mall-backend \
  -p 3000:3000 \
  --env-file .env \
  your-username/mini-mall-backend:latest
```

### 使用 npm 脚本（已添加到 package.json）

```bash
# 标记镜像
npm run docker:tag -- your-username

# 推送镜像
npm run docker:push -- your-username
```

## 📦 方法二：导出为 tar 文件

适用于离线环境或不想使用公共注册表的情况。

### 导出镜像

```bash
cd backend
docker save -o mini-mall-backend.tar mini-mall-backend:latest

# 或者压缩版本（推荐，文件更小）
docker save mini-mall-backend:latest | gzip > mini-mall-backend.tar.gz
```

### 导入镜像

```bash
# 从 tar 文件导入
docker load -i mini-mall-backend.tar

# 从压缩文件导入
gunzip -c mini-mall-backend.tar.gz | docker load
```

### 使用 npm 脚本

```bash
npm run docker:save    # 导出为 tar 文件
npm run docker:load    # 从 tar 文件导入
```

## 📦 方法三：GitHub Container Registry (ghcr.io)

GitHub 提供的容器注册表，与 GitHub 集成良好。

### 步骤 1: 创建 Personal Access Token

1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 创建 token，权限选择 `write:packages` 和 `read:packages`

### 步骤 2: 登录 GitHub Container Registry

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

### 步骤 3: 标记并推送

```bash
docker tag mini-mall-backend:latest ghcr.io/your-username/mini-mall-backend:latest
docker push ghcr.io/your-username/mini-mall-backend:latest
```

### 步骤 4: 拉取镜像

```bash
docker pull ghcr.io/your-username/mini-mall-backend:latest
```

## 📦 方法四：私有注册表

### 使用 Harbor / Nexus / GitLab Container Registry

```bash
# 标记镜像
docker tag mini-mall-backend:latest registry.example.com/mini-mall-backend:latest

# 登录私有注册表
docker login registry.example.com

# 推送镜像
docker push registry.example.com/mini-mall-backend:latest
```

## 📦 方法五：通过 SSH 传输

适用于局域网或直接连接的环境。

### 在源机器上导出

```bash
docker save mini-mall-backend:latest | gzip > mini-mall-backend.tar.gz
```

### 传输到目标机器

```bash
# 使用 scp
scp mini-mall-backend.tar.gz user@target-server:/path/to/destination/

# 或使用 rsync
rsync -avz mini-mall-backend.tar.gz user@target-server:/path/to/destination/
```

### 在目标机器上导入

```bash
gunzip -c mini-mall-backend.tar.gz | docker load
```

## 🔐 安全注意事项

### 1. 不要将敏感信息打包到镜像中

- 使用环境变量传递敏感配置
- 不要将 `.env` 文件复制到镜像中
- 使用 Docker secrets 或环境变量

### 2. 使用多阶段构建

减少镜像大小，只包含运行时需要的文件。

### 3. 定期更新基础镜像

```bash
docker pull node:20-alpine
docker build --no-cache -t mini-mall-backend:latest .
```

### 4. 扫描镜像漏洞

```bash
# 使用 Docker Scout（Docker Desktop 内置）
docker scout quickview mini-mall-backend:latest

# 或使用 Trivy
trivy image mini-mall-backend:latest
```

## 📋 完整工作流程示例

### 构建、标记、推送流程

```bash
cd backend

# 1. 构建镜像
docker build -t mini-mall-backend:latest .

# 2. 测试镜像
docker run -d --name test-backend -p 3000:3000 --env-file .env mini-mall-backend:latest
docker logs test-backend
docker stop test-backend && docker rm test-backend

# 3. 标记镜像
docker tag mini-mall-backend:latest your-username/mini-mall-backend:latest
docker tag mini-mall-backend:latest your-username/mini-mall-backend:v1.0.0

# 4. 登录 Docker Hub
docker login

# 5. 推送镜像
docker push your-username/mini-mall-backend:latest
docker push your-username/mini-mall-backend:v1.0.0
```

## 🚀 CI/CD 集成

### GitHub Actions 示例

```yaml
name: Build and Push Docker Image

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: |
            your-username/mini-mall-backend:latest
            your-username/mini-mall-backend:${{ github.ref_name }}
```

## 📊 镜像大小优化

### 查看镜像大小

```bash
docker images mini-mall-backend:latest
```

### 优化建议

1. 使用 Alpine 基础镜像（已使用）
2. 使用多阶段构建
3. 清理不必要的文件
4. 使用 `.dockerignore`（已配置）

## 🔍 验证镜像

### 检查镜像内容

```bash
# 查看镜像层
docker history mini-mall-backend:latest

# 进入容器检查
docker run -it --rm mini-mall-backend:latest sh
```

### 测试镜像

```bash
docker run -d \
  --name test-backend \
  -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="test-secret" \
  mini-mall-backend:latest

# 检查健康状态
curl http://localhost:3000/health

# 清理
docker stop test-backend && docker rm test-backend
```

## 📚 相关资源

- [Docker Hub 文档](https://docs.docker.com/docker-hub/)
- [GitHub Container Registry 文档](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
