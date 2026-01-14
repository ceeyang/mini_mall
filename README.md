# Mini Mall - 电商平台

一个现代化的电商平台项目，包含前端和后端完整实现。

## 🚀 快速开始

### 一键启动（推荐）

```bash
# 启动前后端服务
./start.sh

# 停止所有服务
./stop.sh
```

启动后访问：
- **前端**: http://localhost:8080
- **后端 API**: http://localhost:3000/api
- **健康检查**: http://localhost:3000/health

### 手动启动

#### 1. 配置环境变量

**后端配置**:
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，配置 MongoDB、JWT 等
```

**前端配置**（可选）:
```bash
cd frontend
cp .env.example .env
# 编辑 .env 文件，配置 API_BASE_URL 等
```

#### 2. 启动后端

```bash
cd backend
npm install
npm run dev
```

#### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

## 📋 项目结构

```
mini_mall/
├── backend/          # 后端服务
│   ├── src/         # 源代码
│   ├── doc/         # 文档
│   ├── .env.example # 环境变量示例
│   └── ...
├── frontend/        # 前端应用
│   ├── src/         # 源代码
│   ├── .env.example # 环境变量示例
│   └── ...
├── doc/             # 项目文档
├── start.sh         # 一键启动脚本
└── stop.sh          # 停止脚本
```

## 🔧 环境变量配置

### 后端环境变量

配置文件位置：`backend/.env`

主要配置项：
- `PORT`: 后端服务端口（默认: 3000）
- `MONGODB_URI`: MongoDB 连接地址
- `JWT_SECRET`: JWT 密钥
- `FRONTEND_URL`: 前端地址（用于 CORS）

创建配置文件：
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件
```

### 前端环境变量

配置文件位置：`frontend/.env`

主要配置项：
- `API_BASE_URL`: 后端 API 地址（默认: http://localhost:3000/api）
- `FRONTEND_URL`: 前端地址（用于 OAuth 回调等）

创建配置文件：
```bash
cd frontend
cp .env.example .env
# 编辑 .env 文件
```

**注意**: 
- 前端环境变量通过 `load-env.js` 脚本加载，支持在浏览器中动态读取
- 前后端可以独立运行，各自使用自己的 `.env` 文件

## 🚀 部署上线

### 快速部署

- **[完整部署指南](doc/DEPLOY_GUIDE.md)** - 包含前端、后端和数据库的完整部署方案
- **[快速部署指南](doc/DEPLOY_NOW.md)** - 快速上手指南
- **[详细部署文档](doc/DEPLOYMENT.md)** - 详细的部署步骤和说明

### 推荐部署方案

| 组件 | 推荐平台 | 费用 |
|------|---------|------|
| 前端 | Vercel | 免费 |
| 后端 | Railway | 免费（$5/月额度） |
| 数据库 | MongoDB Atlas | 免费 |

**快速开始**：
1. 部署数据库：MongoDB Atlas（免费）
2. 部署后端：Railway（免费额度）
3. 部署前端：Vercel（免费）
4. 配置环境变量连接前后端

详细步骤请查看 [完整部署指南](doc/DEPLOY_GUIDE.md)。

## 📚 更多文档

- [后端运行指南](backend/doc/RUN.md)
- [MongoDB 安装指南](backend/doc/MONGODB_SETUP.md)
- [代码规范](backend/doc/CODE_STYLE.md)
- [API 文档生成](backend/doc/API_DOCS.md)
- [Google OAuth 配置指南](doc/GOOGLE_OAUTH_SETUP.md)

## 🛠️ 开发工具

### 后端

```bash
cd backend
npm run lint        # 代码检查
npm run lint:fix    # 自动修复
npm run format      # 代码格式化
npm run docs        # 生成 API 文档
```

### 前端

前端使用原生 JavaScript，无需构建工具。

## 📝 注意事项

1. **端口配置**：
   - 后端运行在 `3000` 端口
   - 前端运行在 `8080` 端口
   - 确保端口未被占用

2. **MongoDB**：
   - 需要先启动 MongoDB
   - 可以使用 Docker: `./backend/start-mongodb.sh`
   - 或使用 MongoDB Atlas 云服务

3. **CORS**：
   - 后端已配置 CORS，允许前端访问
   - 如需修改，编辑 `backend/src/server.js`

4. **环境变量**：
   - 后端使用 `backend/.env`
   - 前端使用 `frontend/.env`
   - 前后端可以独立运行，各自管理自己的配置

## 🐛 常见问题

### 端口被占用

如果端口被占用，可以：
1. 修改 `backend/.env` 中的 `PORT`
2. 修改 `frontend/package.json` 中的端口
3. 更新 `frontend/.env` 中的 `API_BASE_URL`

### MongoDB 连接失败

1. 检查 MongoDB 是否运行
2. 检查 `MONGODB_URI` 配置是否正确
3. 查看后端日志：`tail -f logs/backend.log`

### API 请求失败

1. 检查后端是否正常运行
2. 检查浏览器控制台的错误信息
3. 确认 `API_BASE_URL` 配置正确
4. 检查 CORS 配置

### 环境变量未生效

1. **后端**: 确保 `backend/.env` 文件存在且格式正确
2. **前端**: 确保 `frontend/.env` 文件存在，或检查浏览器控制台是否有加载错误
3. 重启服务使环境变量生效
4. 检查文件路径是否正确（前后端各自在项目根目录）

## 📄 License

MIT
