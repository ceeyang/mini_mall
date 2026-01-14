# 🚀 Mini Mall 完整部署指南

本文档提供 Mini Mall 项目的完整部署方案，包括前端、后端和数据库的部署步骤。

## 📋 部署架构

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   前端      │ ───> │   后端 API  │ ───> │  MongoDB    │
│ (Vercel)    │      │ (Railway)   │      │ (Atlas)     │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🎯 部署方案概览

| 组件 | 推荐方案 | 备选方案 | 费用 |
|------|---------|---------|------|
| 前端 | Vercel | Netlify, GitHub Pages | 免费 |
| 后端 | Railway | Render, Vercel Functions | 免费/低费用 |
| 数据库 | MongoDB Atlas | 自建 MongoDB | 免费 |

---

## 第一部分：数据库部署（MongoDB Atlas）

### 步骤 1: 注册 MongoDB Atlas 账号

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 使用 Google 账号或邮箱注册
3. 选择免费套餐（M0）

### 步骤 2: 创建集群

1. 登录后点击 "Build a Database"
2. 选择 **M0 Free** 套餐
3. 选择云服务商和区域（建议选择离你最近的）
4. 集群名称：`mini-mall-cluster`（或自定义）
5. 点击 "Create"

### 步骤 3: 配置网络访问

1. 在左侧菜单点击 "Network Access"
2. 点击 "Add IP Address"
3. 开发环境：点击 "Allow Access from Anywhere"（添加 `0.0.0.0/0`）
4. 生产环境：添加你的服务器 IP 地址
5. 点击 "Confirm"

### 步骤 4: 创建数据库用户

1. 在左侧菜单点击 "Database Access"
2. 点击 "Add New Database User"
3. 认证方式：选择 "Password"
4. 用户名：`mini-mall-user`（或自定义）
5. 密码：生成强密码并**保存好**
6. 权限：选择 "Atlas admin"（或 "Read and write to any database"）
7. 点击 "Add User"

### 步骤 5: 获取连接字符串

1. 在左侧菜单点击 "Database"
2. 点击 "Connect" 按钮
3. 选择 "Connect your application"
4. 复制连接字符串，格式如下：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini_mall?retryWrites=true&w=majority
   ```
5. **重要**：将 `<username>` 和 `<password>` 替换为实际值

### 步骤 6: 测试连接

```bash
# 使用 MongoDB Compass 或 mongosh 测试连接
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini_mall"
```

---

## 第二部分：后端部署

### 方案 A: Railway 部署（推荐）

#### 优点
- ✅ 免费额度充足（$5/月）
- ✅ 自动 HTTPS
- ✅ 环境变量管理简单
- ✅ 支持 GitHub 自动部署
- ✅ 日志查看方便

#### 步骤 1: 准备代码

确保代码已推送到 GitHub（见前端部署步骤 1-3）。

#### 步骤 2: 部署到 Railway

1. **访问 Railway**：https://railway.app
2. **登录**：使用 GitHub 账号登录
3. **创建项目**：
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的 `mini_mall` 仓库
4. **配置服务**：
   - Railway 会自动检测到 `backend/` 目录
   - 如果没有，点击 "Add Service" → "GitHub Repo"
   - 选择仓库，Root Directory 设置为 `backend`
5. **配置环境变量**：
   - 点击服务 → "Variables"
   - 添加以下环境变量：

   ```env
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini_mall?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

6. **部署**：
   - Railway 会自动开始部署
   - 等待部署完成（约 2-3 分钟）
7. **获取后端 URL**：
   - 部署完成后，Railway 会提供一个 URL
   - 格式：`https://mini-mall-backend.railway.app`
   - 点击 "Settings" → "Generate Domain" 可以生成自定义域名

#### 步骤 3: 配置启动命令

Railway 会自动检测 `package.json` 中的 `start` 脚本，无需额外配置。

---

### 方案 B: Render 部署

#### 步骤 1: 部署到 Render

1. **访问 Render**：https://render.com
2. **登录**：使用 GitHub 账号登录
3. **创建 Web Service**：
   - 点击 "New" → "Web Service"
   - 选择你的 `mini_mall` 仓库
4. **配置服务**：
   - **Name**: `mini-mall-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`
5. **环境变量**：同 Railway 配置
6. **部署**：点击 "Create Web Service"

---

### 方案 C: Vercel Serverless Functions（适合小型项目）

#### 步骤 1: 配置 Vercel

1. 在项目根目录创建 `vercel.json`（已存在）
2. 修改 `vercel.json` 添加后端配置：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. 在 Vercel 项目设置中添加环境变量

---

## 第三部分：前端部署

### 方案 A: Vercel 部署（推荐）

#### 步骤 1: 准备代码

1. **初始化 Git（如果还没有）**：
```bash
cd /Users/cee/Desktop/github/mini_mall
git init
git add .
git commit -m "Initial commit"
```

2. **创建 GitHub 仓库**：
   - 访问 https://github.com/new
   - 仓库名称：`mini_mall`
   - 不要勾选任何初始化选项
   - 点击 "Create repository"

3. **推送到 GitHub**：
```bash
git remote add origin https://github.com/YOUR_USERNAME/mini_mall.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 部署到 Vercel

1. **访问 Vercel**：https://vercel.com
2. **登录**：使用 GitHub 账号登录
3. **导入项目**：
   - 点击 "Add New Project"
   - 选择 `mini_mall` 仓库
   - 点击 "Import"
4. **配置项目**：
   - **Framework Preset**: `Other`
   - **Root Directory**: `frontend`
   - **Build Command**: 留空
   - **Output Directory**: 留空
   - **Install Command**: 留空
5. **环境变量**：
   - 点击 "Environment Variables"
   - 添加以下变量：

   ```env
   API_BASE_URL=https://your-backend-url.railway.app/api
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. **部署**：
   - 点击 "Deploy"
   - 等待部署完成（约 1-2 分钟）
7. **获取前端 URL**：
   - 格式：`https://mini-mall-xxxxx.vercel.app`

---

### 方案 B: Netlify 部署

#### 步骤 1: 部署到 Netlify

1. **访问 Netlify**：https://www.netlify.com
2. **登录**：使用 GitHub 账号登录
3. **导入项目**：
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub → 选择 `mini_mall` 仓库
4. **配置构建设置**：
   - **Branch to deploy**: `main`
   - **Base directory**: `frontend`
   - **Build command**: 留空
   - **Publish directory**: `frontend`
5. **环境变量**：
   - 点击 "Site settings" → "Environment variables"
   - 添加 `API_BASE_URL` 和 `FRONTEND_URL`
6. **部署**：点击 "Deploy site"

---

## 第四部分：配置前后端连接

### 步骤 1: 更新前端环境变量

在前端部署平台（Vercel/Netlify）的环境变量中设置：

```env
API_BASE_URL=https://your-backend-url.railway.app/api
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 步骤 2: 更新后端环境变量

在后端部署平台（Railway/Render）的环境变量中设置：

```env
FRONTEND_URL=https://your-frontend-url.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini_mall
```

### 步骤 3: 更新 CORS 配置

后端已配置 CORS，会自动允许 `FRONTEND_URL` 的请求。

### 步骤 4: 测试连接

1. 访问前端网站
2. 打开浏览器开发者工具（F12）
3. 检查 Network 标签，确认 API 请求正常
4. 测试登录、注册等功能

---

## 第五部分：域名配置（可选）

### 配置自定义域名

#### 前端域名（Vercel）

1. 在 Vercel 项目页面 → "Settings" → "Domains"
2. 输入你的域名（如 `www.yourdomain.com`）
3. 按照提示配置 DNS：
   - CNAME 记录：`www` → `cname.vercel-dns.com`
   - 或 A 记录：`@` → `76.76.21.21`
4. 等待 DNS 生效（几分钟到几小时）

#### 后端域名（Railway）

1. 在 Railway 服务页面 → "Settings" → "Generate Domain"
2. 或使用自定义域名：
   - 添加 CNAME 记录指向 Railway 提供的域名

#### 更新环境变量

配置域名后，记得更新前后端的环境变量中的 URL。

---

## 📋 部署检查清单

### 部署前

- [ ] 代码已推送到 GitHub
- [ ] 本地测试通过
- [ ] 环境变量已准备好

### 数据库

- [ ] MongoDB Atlas 集群已创建
- [ ] 网络访问已配置（允许所有 IP 或服务器 IP）
- [ ] 数据库用户已创建
- [ ] 连接字符串已获取

### 后端

- [ ] 后端已部署到 Railway/Render
- [ ] 环境变量已配置（MONGODB_URI, JWT_SECRET, FRONTEND_URL）
- [ ] 后端 URL 可访问（测试 `/health` 端点）
- [ ] API 文档可访问（如果有）

### 前端

- [ ] 前端已部署到 Vercel/Netlify
- [ ] 环境变量已配置（API_BASE_URL, FRONTEND_URL）
- [ ] 前端网站可访问
- [ ] 可以正常调用后端 API

### 功能测试

- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 商品列表可以加载
- [ ] 购物车功能正常
- [ ] 订单创建功能正常
- [ ] 支付流程正常（如果已实现）

---

## 🔧 常见问题

### Q1: 后端部署后无法连接 MongoDB？

**A:** 检查：
1. MongoDB Atlas 网络访问是否允许了服务器 IP
2. 连接字符串中的用户名和密码是否正确
3. 数据库名称是否正确（`mini_mall`）

### Q2: 前端无法调用后端 API？

**A:** 检查：
1. 前端环境变量 `API_BASE_URL` 是否正确
2. 后端 CORS 配置是否正确
3. 浏览器控制台是否有错误信息
4. 后端服务是否正常运行

### Q3: 环境变量不生效？

**A:** 
1. 确保在部署平台正确设置了环境变量
2. 重新部署服务（环境变量更改后需要重新部署）
3. 检查变量名是否正确（区分大小写）

### Q4: 如何查看日志？

**Railway:**
- 在服务页面点击 "Deployments" → 选择部署 → 查看日志

**Render:**
- 在服务页面点击 "Logs" 标签

**Vercel:**
- 在项目页面点击 "Deployments" → 选择部署 → 查看日志

### Q5: 如何回滚到之前的版本？

**Railway:**
- 在 "Deployments" 页面选择之前的部署 → "Redeploy"

**Vercel:**
- 在 "Deployments" 页面选择之前的部署 → "Promote to Production"

---

## 🔄 持续部署

### 自动部署

所有推荐的平台都支持自动部署：

- **GitHub 推送** → 自动触发部署
- **main 分支** → 部署到生产环境
- **其他分支** → 创建预览部署

### 手动部署

如果需要手动触发部署：

```bash
# 推送代码到 GitHub
git add .
git commit -m "Update: 描述你的更改"
git push origin main

# 平台会自动检测并部署
```

---

## 📞 获取帮助

如果遇到问题：

1. **查看平台文档**：
   - Railway: https://docs.railway.app
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs
   - MongoDB Atlas: https://docs.atlas.mongodb.com

2. **检查项目文档**：
   - `doc/DEPLOYMENT.md` - 详细部署步骤
   - `doc/DEPLOY_NOW.md` - 快速部署指南
   - `README.md` - 项目说明

3. **提交 Issue**：
   - 在 GitHub 仓库提交 Issue 描述问题

---

## 🎉 部署完成！

部署完成后，你的 Mini Mall 就可以在互联网上访问了！

**下一步**：
- 测试所有功能
- 配置自定义域名（可选）
- 设置监控和告警（可选）
- 定期备份数据库

**祝部署顺利！** 🚀
