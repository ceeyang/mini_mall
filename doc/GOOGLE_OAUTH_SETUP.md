# Google OAuth 配置指南

本文档详细说明如何为 Mini Mall 项目配置 Google OAuth 登录功能。

## 📋 前置准备

1. **Google 账号**
   - 需要一个 Google 账号（Gmail 账号即可）

2. **访问 Google Cloud Console**
   - 访问：https://console.cloud.google.com/
   - 使用你的 Google 账号登录

## 🔧 配置步骤

### 步骤 1: 创建项目（如果还没有）

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击左上角的项目选择器
3. 点击"新建项目"
4. 输入项目名称（如：`Mini Mall`）
5. 点击"创建"

### 步骤 2: 启用 Google+ API

1. 在左侧菜单中，点击"API 和服务" → "库"
2. 在搜索框中输入 "Google+ API" 或 "People API"
3. 点击进入 API 详情页
4. 点击"启用"按钮

**注意**：Google+ API 已被弃用，现在使用 **People API**。如果找不到 Google+ API，请启用 **People API**。

### 步骤 3: 配置 OAuth 同意屏幕

1. 在左侧菜单中，点击"API 和服务" → "OAuth 同意屏幕"
2. 选择用户类型：
   - **外部**：任何人都可以使用（推荐用于测试）
   - **内部**：仅限组织内用户（需要 Google Workspace）
3. 点击"创建"
4. 填写应用信息：
   - **应用名称**：Mini Mall（或你喜欢的名称）
   - **用户支持电子邮件**：你的邮箱
   - **开发者联系信息**：你的邮箱
5. 点击"保存并继续"
6. 在"作用域"页面，点击"保存并继续"（使用默认作用域即可）
7. 在"测试用户"页面（如果选择外部用户类型）：
   - 点击"添加用户"
   - 添加你的测试邮箱
   - 点击"保存并继续"
8. 在"摘要"页面，点击"返回仪表板"

### 步骤 4: 创建 OAuth 2.0 客户端 ID

1. 在左侧菜单中，点击"API 和服务" → "凭据"
2. 点击顶部的"+ 创建凭据"
3. 选择"OAuth 客户端 ID"
4. 选择应用类型：**Web 应用**
5. 填写信息：
   - **名称**：Mini Mall Web Client（或你喜欢的名称）
   - **已授权的 JavaScript 源**：
     ```
     http://localhost:8080
     ```
   - **已授权的重定向 URI**：
     ```
     http://localhost:3000/api/auth/google/callback
     ```
   
   **重要**：
   - 开发环境使用 `localhost`
   - 生产环境需要替换为实际域名
   - 重定向 URI 必须与后端配置的 `GOOGLE_CALLBACK_URL` 完全一致

6. 点击"创建"
7. **保存凭证信息**：
   - **客户端 ID**：类似 `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - **客户端密钥**：类似 `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   
   ⚠️ **重要**：客户端密钥只显示一次，请立即保存！

### 步骤 5: 配置后端环境变量

1. 进入项目根目录的 `backend` 文件夹
2. 复制 `.env.example` 为 `.env`（如果还没有）：
   ```bash
   cd backend
   cp .env.example .env
   ```

3. 编辑 `backend/.env` 文件，添加以下配置：
   ```env
   # Google OAuth 配置
   GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=你的客户端密钥
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

   **示例**：
   ```env
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

### 步骤 6: 重启后端服务

配置完成后，需要重启后端服务：

```bash
# 停止服务
./stop.sh

# 重新启动
./start.sh
```

## 🧪 测试 Google OAuth

1. 访问前端登录页面：http://localhost:8080/src/pages/login.html
2. 点击"使用 Google 账号登录"按钮
3. 应该会跳转到 Google 登录页面
4. 选择你的 Google 账号并授权
5. 授权成功后，应该会重定向回前端并自动登录

## 🌐 生产环境配置

在生产环境中，需要更新以下配置：

### 1. Google Cloud Console

在"凭据"页面，编辑你的 OAuth 客户端：

- **已授权的 JavaScript 源**：
  ```
  https://your-domain.com
  ```

- **已授权的重定向 URI**：
  ```
  https://your-domain.com/api/auth/google/callback
  ```
  或
  ```
  https://your-backend-domain.com/api/auth/google/callback
  ```

### 2. 后端环境变量

更新 `backend/.env`：

```env
GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=你的客户端密钥
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. OAuth 同意屏幕

1. 在 Google Cloud Console 中，进入"OAuth 同意屏幕"
2. 更新应用信息：
   - 添加应用图标
   - 完善隐私政策链接
   - 完善服务条款链接
3. 提交审核（如果选择"外部"用户类型）

## ❓ 常见问题

### Q1: 提示 "redirect_uri_mismatch" 错误

**原因**：重定向 URI 不匹配

**解决方法**：
1. 检查 `backend/.env` 中的 `GOOGLE_CALLBACK_URL` 是否与 Google Cloud Console 中配置的完全一致
2. 确保协议（http/https）、域名、端口、路径都完全匹配
3. 注意末尾不要有多余的斜杠

### Q2: 提示 "invalid_client" 错误

**原因**：客户端 ID 或密钥错误

**解决方法**：
1. 检查 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET` 是否正确
2. 确保没有多余的空格或换行
3. 重新创建 OAuth 客户端 ID

### Q3: 提示 "access_denied" 错误

**原因**：用户拒绝了授权请求

**解决方法**：
1. 这是正常情况，用户可以选择拒绝授权
2. 如果测试账号无法授权，检查"OAuth 同意屏幕"中是否添加了测试用户

### Q4: 本地开发可以，但生产环境不行

**原因**：生产环境的域名和重定向 URI 未正确配置

**解决方法**：
1. 在 Google Cloud Console 中添加生产环境的授权源和重定向 URI
2. 更新后端环境变量中的 `GOOGLE_CALLBACK_URL` 和 `FRONTEND_URL`
3. 确保使用 HTTPS（Google OAuth 要求生产环境使用 HTTPS）

### Q5: 如何查看当前的 OAuth 配置？

在 Google Cloud Console 中：
1. 进入"API 和服务" → "凭据"
2. 点击你的 OAuth 客户端 ID
3. 可以查看和编辑配置

## 📚 参考文档

- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Passport Google Strategy 文档](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🔒 安全注意事项

1. **保护客户端密钥**：
   - 永远不要将 `.env` 文件提交到 Git
   - 客户端密钥应该保密，只存储在服务器端

2. **HTTPS 要求**：
   - 生产环境必须使用 HTTPS
   - Google OAuth 在生产环境要求 HTTPS

3. **重定向 URI 验证**：
   - 只添加你信任的域名
   - 不要使用通配符（`*`）在生产环境

4. **定期轮换密钥**：
   - 如果密钥泄露，立即在 Google Cloud Console 中删除并重新创建

---

**配置完成后，Google OAuth 登录功能就可以正常使用了！** 🎉
