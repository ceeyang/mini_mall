# Google OAuth 接入指南

本文档说明如何将 Google OAuth 集成到 Mini Mall 项目中。

## 📋 前置准备

1. **Google Cloud Console 账号**
   - 访问 https://console.cloud.google.com/
   - 创建新项目或选择现有项目

2. **启用 Google+ API**
   - 在 API 库中搜索 "Google+ API"
   - 点击启用

3. **创建 OAuth 2.0 客户端 ID**
   - 进入"凭据"页面
   - 点击"创建凭据" → "OAuth 客户端 ID"
   - 应用类型：Web 应用
   - 已授权的 JavaScript 源：`https://your-domain.com`
   - 已授权的重定向 URI：`https://your-domain.com/auth/google/callback`

## 🔧 前端集成

### 方法 1: 使用 Google Identity Services（推荐）

#### 步骤 1: 引入 Google Identity Services

在 `login.html` 的 `<head>` 中添加：

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

#### 步骤 2: 更新登录组件

在 `src/components/login.js` 中的 `loginWithGoogle` 方法：

```javascript
async loginWithGoogle() {
  return new Promise((resolve, reject) => {
    // 初始化 Google Identity Services
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: async (response) => {
        try {
          // 解码 JWT token 获取用户信息
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          
          // 调用后端 API
          const backendResponse = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credential: response.credential,
              userInfo: {
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                sub: payload.sub
              }
            })
          });
          
          const data = await backendResponse.json();
          if (data.success) {
            this.saveUser(data.user);
            resolve({ success: true, user: data.user });
          } else {
            resolve({ success: false, message: data.message });
          }
        } catch (error) {
          console.error('Google 登录错误:', error);
          resolve({ success: false, message: '登录失败，请重试' });
        }
      }
    });

    // 显示 Google 登录按钮
    google.accounts.id.renderButton(
      document.getElementById('google-login-btn'),
      { 
        theme: 'outline', 
        size: 'large',
        width: '100%'
      }
    );
  });
}
```

### 方法 2: 使用传统 OAuth 2.0 流程

#### 步骤 1: 创建授权 URL

```javascript
async loginWithGoogle() {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID';
  const redirectUri = encodeURIComponent('https://your-domain.com/auth/google/callback');
  const scope = encodeURIComponent('email profile');
  const responseType = 'code';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
  // 跳转到 Google 授权页面
  window.location.href = authUrl;
}
```

#### 步骤 2: 处理回调

创建 `auth/google/callback.html` 页面处理回调：

```javascript
// 从 URL 获取授权码
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
  // 调用后端 API 交换 token
  const response = await fetch('/api/auth/google/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  
  const data = await response.json();
  if (data.success) {
    authManager.saveUser(data.user);
    window.location.href = 'user-center.html';
  }
}
```

## 🔒 后端实现

### Node.js + Express 示例

```javascript
const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth 回调
router.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // 验证 token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // 查找或创建用户
    let user = await User.findOne({ googleId: payload.sub });
    
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        googleId: payload.sub,
        loginMethod: 'google'
      });
    }
    
    // 生成 JWT token（可选）
    const token = generateJWT(user);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        loginMethod: 'google'
      },
      token: token
    });
  } catch (error) {
    console.error('Google OAuth 错误:', error);
    res.json({
      success: false,
      message: '登录失败，请重试'
    });
  }
});
```

## 🔐 安全注意事项

1. **客户端 ID 安全**
   - 客户端 ID 可以暴露在前端
   - 但必须设置正确的授权域名和重定向 URI

2. **Token 验证**
   - 后端必须验证 Google 返回的 token
   - 不要信任前端传来的用户信息

3. **HTTPS 要求**
   - Google OAuth 要求使用 HTTPS
   - 本地开发可以使用 `http://localhost`

4. **用户数据保护**
   - 遵守 GDPR 和隐私政策
   - 明确告知用户数据使用方式

## 📝 配置示例

### 环境变量

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback
```

### 前端配置

在 `src/scripts/auth.js` 中更新：

```javascript
async loginWithGoogle() {
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
  
  // 使用 Google Identity Services
  // 或传统 OAuth 2.0 流程
}
```

## 🧪 测试

### 测试账号

使用你的 Google 账号进行测试。

### 测试步骤

1. 点击"使用 Google 账号登录"按钮
2. 选择 Google 账号
3. 授权应用访问
4. 验证用户信息是否正确保存
5. 检查是否能正常访问用户中心

## 📚 参考文档

- [Google Identity Services 文档](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [Google+ API 文档](https://developers.google.com/+/web/api/rest)

---

**注意**：当前代码中的 Google 登录为模拟实现，实际接入时需要替换为真实的 Google OAuth 流程。
