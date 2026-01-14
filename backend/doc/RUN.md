# Backend 运行指南

## 📋 前置要求

1. **Node.js**: 版本 >= 18.0.0
2. **MongoDB**: 本地安装或使用 MongoDB Atlas 云服务

## 🚀 快速启动步骤

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB 配置
# 本地 MongoDB（默认）
MONGODB_URI=mongodb://localhost:27017/mini_mall

# 或使用 MongoDB Atlas 云服务
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mini_mall

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Google OAuth 配置（可选）
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 3. 启动 MongoDB

**推荐方式：使用 Docker（最简单）**

```bash
# 方式 1: 使用启动脚本（推荐）
./start-mongodb.sh

# 方式 2: 手动启动 Docker 容器
docker run -d -p 27017:27017 --name mongodb -v mongodb_data:/data/db mongo:latest
```

**其他方式：**

**使用 Homebrew（如果已安装）:**
```bash
brew services start mongodb-community
```

**使用 MongoDB Atlas（云服务，无需本地安装）:**
1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 创建免费集群
3. 获取连接字符串
4. 在 `.env` 文件中更新 `MONGODB_URI`

**详细说明请查看:** `MONGODB_SETUP.md`（同目录下）

### 4. 初始化数据库（可选）

运行种子脚本初始化商品数据：

```bash
node database/seeds/products.js
```

### 5. 启动服务器

**开发模式（推荐，自动重启）:**
```bash
npm run dev
```

**生产模式:**
```bash
npm start
```

### 6. 验证服务器运行

打开浏览器访问：
- 健康检查: http://localhost:3000/health
- API 文档: 查看 `README.md`

## 🔍 常见问题

### 问题 1: MongoDB 连接失败

**错误信息:**
```
❌ MongoDB 连接失败: connect ECONNREFUSED 127.0.0.1:27017
```

**解决方案:**
1. 确认 MongoDB 服务正在运行
2. 检查 `MONGODB_URI` 配置是否正确
3. 如果使用 MongoDB Atlas，检查网络访问白名单

### 问题 2: 端口被占用

**错误信息:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案:**
1. 修改 `.env` 中的 `PORT` 为其他端口（如 3001）
2. 或关闭占用 3000 端口的其他程序

### 问题 3: 缺少依赖

**错误信息:**
```
Cannot find module 'xxx'
```

**解决方案:**
```bash
npm install
```

## 📝 API 测试

服务器启动后，可以使用以下方式测试 API：

### 使用 curl:

```bash
# 健康检查
curl http://localhost:3000/health

# 用户注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com","password":"123456"}'

# 用户登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### 使用 Postman 或类似工具:

导入 API 集合（如果有），或手动测试各个端点。

## 🛠️ 开发建议

1. **使用 nodemon**: 开发时使用 `npm run dev`，代码修改后自动重启
2. **查看日志**: 服务器日志会显示连接状态和错误信息
3. **环境变量**: 生产环境务必修改 `JWT_SECRET` 为强密钥
4. **数据库备份**: 定期备份 MongoDB 数据

## 📚 更多信息

- 详细 API 文档: 查看 `README.md`
- 项目结构: 查看 `README.md` 中的目录结构说明
- 支付集成: 查看 `doc/PAYMENT_INTEGRATION.md`
- Google OAuth: 查看 `doc/GOOGLE_OAUTH.md`
