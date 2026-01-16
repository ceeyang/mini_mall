# 跨域问题解决方案

本文档说明如何解决前端访问后端时的跨域（CORS）问题。

## 📋 问题描述

当前项目前端和后端部署在同一个服务器上，前端访问后端 `localhost:8080` 时提示跨域错误。

**跨域错误示例：**
```
Access to fetch at 'http://localhost:8080/api/products' from origin 'http://localhost:3000' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ 解决方案

有两种解决方案，推荐使用**方案二（Nginx 代理）**，这是生产环境的最佳实践。

---

## 方案一：修复后端 CORS 配置（快速解决）

### 适用场景
- 开发环境
- 快速测试
- 小规模部署

### 解决步骤

#### 1. 检查后端 CORS 配置

后端已经配置了 CORS，但需要确保配置正确。检查 `backend/src/server.js` 中的 CORS 配置。

#### 2. 配置环境变量

在 `backend/.env` 文件中设置：

```env
# 允许所有 localhost 端口（开发环境）
FRONTEND_URL=*

# 或者指定具体的前端地址
FRONTEND_URL=http://localhost:3000

# 或者生产环境的域名
FRONTEND_URL=https://your-domain.com
```

#### 3. 重启后端服务

```bash
# 如果使用 PM2
pm2 restart mini_mall_backend

# 如果直接运行
cd backend
npm start
```

### 优点
- ✅ 配置简单，快速解决
- ✅ 不需要安装额外软件
- ✅ 适合开发环境

### 缺点
- ❌ 生产环境不够安全（需要精确配置允许的域名）
- ❌ 仍然暴露后端端口
- ❌ 需要处理 CORS 预检请求

---

## 方案二：使用 Nginx 反向代理（推荐）

### 适用场景
- 生产环境
- 需要 HTTPS
- 需要更好的安全性和性能

### 工作原理

使用 Nginx 作为反向代理，将前端和后端都通过同一个域名访问：

```
用户浏览器
    ↓
Nginx (80/443 端口)
    ├─→ / → 前端静态文件
    └─→ /api → 后端 API (代理到 localhost:8080)
```

这样前端和后端使用同一个域名，**不会产生跨域问题**。

### 解决步骤

#### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
# 或
sudo dnf install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2. 配置 Nginx

**Ubuntu/Debian:**
```bash
sudo nano /etc/nginx/sites-available/mini_mall
```

**CentOS/RHEL:**
```bash
sudo nano /etc/nginx/conf.d/mini_mall.conf
```

复制项目根目录下的 `nginx.conf.example` 内容，并根据实际情况修改：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    # 前端静态文件目录
    root /var/www/mini_mall/frontend;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        # 代理到后端服务（端口 8080）
        proxy_pass http://localhost:8080;
        
        # 代理头设置
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

#### 3. 部署前端文件

```bash
# 创建前端目录
sudo mkdir -p /var/www/mini_mall/frontend
sudo chown -R $USER:$USER /var/www/mini_mall/frontend

# 复制前端文件
cp -r frontend/* /var/www/mini_mall/frontend/
```

#### 4. 修改前端配置

确保前端使用相对路径 `/api`，而不是绝对路径 `http://localhost:8080/api`。

检查 `frontend/src/scripts/config.js`：

```javascript
export const config = {
  // 使用相对路径，自动使用当前域名
  API_BASE_URL: '/api',
  // ...
};
```

或者通过环境变量设置（在 `frontend/index.html` 中添加）：

```html
<meta name="env-API_BASE_URL" content="/api">
```

#### 5. 启用 Nginx 配置

**Ubuntu/Debian:**
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/mini_mall /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

**CentOS/RHEL:**
```bash
# 配置文件已在 /etc/nginx/conf.d/ 目录下，直接测试和重载
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. 配置防火墙

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # 如果使用 HTTPS

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**注意：** 后端端口（8080）**不需要**对外开放，因为只有 Nginx 通过 localhost 访问。

### 优点
- ✅ **完全避免跨域问题**（同源策略）
- ✅ 后端端口不直接暴露，更安全
- ✅ 可以配置 SSL 证书（HTTPS）
- ✅ 统一域名访问，用户体验更好
- ✅ 可以配置缓存、压缩等性能优化
- ✅ 生产环境最佳实践

### 缺点
- ❌ 需要安装和配置 Nginx
- ❌ 需要额外的服务器资源

---

## 🔍 验证配置

### 方案一验证（CORS 配置）

1. **检查后端 CORS 响应头：**
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:8080/api/products \
     -v
```

应该看到 `Access-Control-Allow-Origin` 响应头。

2. **测试 API 请求：**
```bash
curl -H "Origin: http://localhost:3000" \
     http://localhost:8080/api/products
```

### 方案二验证（Nginx 代理）

1. **测试后端服务：**
```bash
curl http://localhost:8080/api/health
```

2. **测试 Nginx 代理：**
```bash
curl http://localhost/api/health
# 或
curl http://your-domain.com/api/health
```

3. **在浏览器中访问：**
- 前端页面：`http://your-domain.com/`
- API 健康检查：`http://your-domain.com/api/health`

---

## 🐛 故障排查

### 问题 1: 仍然出现跨域错误

**可能原因：**
- CORS 配置不正确
- 前端使用了错误的 API 地址
- 后端服务未重启

**解决方法：**
1. 检查后端日志，查看 CORS 拒绝的来源
2. 确认前端 `config.js` 中的 `API_BASE_URL` 配置
3. 重启后端服务

### 问题 2: Nginx 502 Bad Gateway

**可能原因：**
- 后端服务未运行
- 后端端口配置错误
- Nginx 无法连接到后端

**解决方法：**
1. 检查后端服务：`pm2 list` 或 `systemctl status mini_mall`
2. 检查后端端口：`netstat -tulpn | grep 8080`
3. 检查 Nginx 错误日志：`sudo tail -f /var/log/nginx/mini_mall_error.log`

### 问题 3: 前端页面显示但 API 请求失败

**可能原因：**
- 前端 API 地址配置错误
- Nginx 代理配置错误

**解决方法：**
1. 打开浏览器开发者工具 → Network，查看 API 请求的 URL
2. 确认请求发送到 `/api/xxx` 而不是 `http://localhost:8080/api/xxx`
3. 检查 Nginx 配置中的 `proxy_pass` 是否正确

---

## 📝 配置检查清单

### 方案一（CORS 配置）
- [ ] 后端 `.env` 中 `FRONTEND_URL` 配置正确
- [ ] 后端服务已重启
- [ ] 前端 `config.js` 中 `API_BASE_URL` 配置正确
- [ ] 浏览器控制台无 CORS 错误

### 方案二（Nginx 代理）
- [ ] Nginx 已安装并运行
- [ ] Nginx 配置文件已创建并测试通过
- [ ] 前端文件已部署到指定目录
- [ ] 前端 `config.js` 中 `API_BASE_URL` 设置为 `/api`
- [ ] 后端服务运行在 `localhost:8080`
- [ ] Nginx 配置中的 `proxy_pass` 指向正确的后端地址
- [ ] 防火墙已开放 80 和 443 端口
- [ ] 后端端口（8080）未对外开放（安全）

---

## 🎯 推荐方案

**开发环境：** 使用方案一（CORS 配置），简单快速。

**生产环境：** 使用方案二（Nginx 代理），更安全、更专业。

---

## 📚 参考文档

- [单服务器部署指南](./DEPLOY_SINGLE_SERVER.md) - 详细的 Nginx 配置说明
- [后端运行指南](../backend/doc/RUN.md) - 后端配置说明
- [Nginx 官方文档](https://nginx.org/en/docs/)

---

## 💡 提示

1. **如果使用 Nginx 代理，后端 CORS 配置可以更严格**，因为前端和后端使用同一个域名，不会产生跨域问题。

2. **生产环境建议配置 HTTPS**，使用 Let's Encrypt 免费 SSL 证书：
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

3. **如果前端和后端都在同一服务器，使用 Nginx 代理是最佳实践**，可以：
   - 避免跨域问题
   - 提高安全性（后端端口不暴露）
   - 统一管理（一个域名访问所有服务）
   - 方便配置 SSL 证书
