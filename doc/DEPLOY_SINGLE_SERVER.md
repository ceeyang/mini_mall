# 单服务器部署指南（前端 + 后端）

本文档说明如何将前端和后端部署在同一台服务器上。

## ⚠️ 重要说明：为什么不能直接使用 localhost？

**浏览器中的 JavaScript 无法直接访问服务器的 localhost！**

- 前端代码在**用户的浏览器**中运行，不是在服务器上
- 浏览器中的 `localhost` 指向**用户的本地机器**，不是服务器
- 如果前端使用 `http://localhost:3000/api`，浏览器会尝试访问用户自己电脑的 3000 端口，而不是服务器的

## ✅ 解决方案：使用 Nginx 反向代理（推荐）

最佳方案是使用 Nginx 作为反向代理，将前端和后端都通过同一个域名访问：

```
用户浏览器
    ↓
Nginx (80/443 端口)
    ├─→ / → 前端静态文件
    └─→ /api → 后端 API (代理到 3000 或 7891 端口)
```

### 优势

- ✅ 前端使用相对路径 `/api`，无需配置 IP 地址
- ✅ 避免 CORS 跨域问题
- ✅ 后端端口不直接暴露，更安全
- ✅ 可以配置 SSL 证书（HTTPS）
- ✅ 统一域名访问

## 📋 部署架构

```
服务器
├── Nginx (端口 80/443)
│   ├── 前端静态文件: /var/www/mini_mall/frontend
│   └── 反向代理: /api → http://localhost:3000/api
│
├── 后端服务 (端口 3000 或 7891)
│   └── /opt/mini_mall/backend
│
└── MongoDB
    └── 本地或远程连接
```

## 🚀 部署步骤

### 步骤 1: 部署后端

参考 `backend/doc/DEPLOY_DIRECT.md` 部署后端服务，确保：
- 后端运行在 `localhost:3000` 或 `localhost:7891`
- 后端绑定到 `0.0.0.0`（已在 `server.js` 中配置）

### 步骤 2: 部署前端静态文件

#### 2.1 构建前端（如果需要）

```bash
# 在本地或服务器上
cd frontend
# 如果有构建步骤，执行构建命令
# 如果没有，直接使用源码
```

#### 2.2 上传前端文件到服务器

```bash
# 创建前端目录
sudo mkdir -p /var/www/mini_mall/frontend
sudo chown -R $USER:$USER /var/www/mini_mall/frontend

# 上传前端文件（使用 SCP 或 Git）
# 方法一：使用 SCP
scp -r frontend/* user@your-server:/var/www/mini_mall/frontend/

# 方法二：使用 Git
cd /var/www/mini_mall
git clone https://github.com/your-username/mini_mall.git temp
cp -r temp/frontend/* frontend/
rm -rf temp
```

#### 2.3 配置前端 API 地址

前端需要配置为使用相对路径 `/api`，这样会自动使用当前域名。

**方法一：修改 `frontend/src/scripts/config.js`**

```javascript
export const config = {
  // 使用相对路径，自动使用当前域名
  API_BASE_URL: getEnv('API_BASE_URL', '/api'),
  FRONTEND_URL: getEnv('FRONTEND_URL', ''),
};
```

**方法二：通过环境变量配置**

在 `frontend/index.html` 中添加：

```html
<meta name="env-API_BASE_URL" content="/api">
```

**方法三：通过 Nginx 注入环境变量**

在 Nginx 配置中设置（见步骤 3）。

### 步骤 3: 安装和配置 Nginx

#### 3.1 安装 Nginx

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

#### 3.2 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/mini_mall
```

**Ubuntu/Debian 配置路径：** `/etc/nginx/sites-available/mini_mall`  
**CentOS/RHEL 配置路径：** `/etc/nginx/conf.d/mini_mall.conf`

#### 3.3 Nginx 配置内容

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或 IP

    # 前端静态文件
    root /var/www/mini_mall/frontend;
    index index.html;

    # 前端路由（支持 SPA）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        # 移除 /api 前缀，转发到后端
        rewrite ^/api/(.*)$ /api/$1 break;
        
        # 代理到后端服务
        proxy_pass http://localhost:3000;  # 如果后端使用 3000 端口
        # 或
        # proxy_pass http://localhost:7891;  # 如果后端使用 7891 端口
        
        # 代理头设置
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲设置
        proxy_buffering off;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 日志
    access_log /var/log/nginx/mini_mall_access.log;
    error_log /var/log/nginx/mini_mall_error.log;
}
```

#### 3.4 启用配置

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

### 步骤 4: 配置防火墙

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp  # 如果使用 HTTPS

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**注意：** 后端端口（3000 或 7891）**不需要**对外开放，因为只有 Nginx 通过 localhost 访问。

### 步骤 5: 配置 SSL 证书（可选，推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu/Debian
sudo yum install -y certbot python3-certbot-nginx  # CentOS/RHEL

# 获取证书（需要域名已解析到服务器 IP）
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 🔧 配置说明

### 后端端口选择

- **3000 端口**：常见默认端口
- **7891 端口**：项目当前配置

在 Nginx 配置中，根据实际使用的端口修改 `proxy_pass`：

```nginx
# 使用 3000 端口
proxy_pass http://localhost:3000;

# 或使用 7891 端口
proxy_pass http://localhost:7891;
```

### 前端 API 配置

前端应使用相对路径 `/api`，这样：
- 开发环境：`http://localhost:8080` → API: `http://localhost:8080/api` → Nginx 代理到后端
- 生产环境：`http://your-domain.com` → API: `http://your-domain.com/api` → Nginx 代理到后端

### 环境变量配置

#### 后端环境变量

在 `backend/.env` 中配置：

```env
NODE_ENV=production
PORT=3000  # 或 7891
MONGODB_URI=mongodb://localhost:27017/mini_mall
# 或 MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/mini_mall
```

#### 前端环境变量

前端可以通过以下方式配置：

1. **修改 `config.js` 默认值**（推荐）
2. **在 `index.html` 中添加 meta 标签**
3. **通过 Nginx 注入**（见下方）

## 🧪 测试部署

### 1. 测试后端服务

```bash
# 在服务器上测试
curl http://localhost:3000/api/health
# 或
curl http://localhost:7891/api/health
```

### 2. 测试 Nginx 代理

```bash
# 在服务器上测试
curl http://localhost/api/health
```

### 3. 测试前端访问

在浏览器中访问：
- `http://your-server-ip/` - 应该显示前端页面
- `http://your-server-ip/api/health` - 应该返回后端健康检查

### 4. 检查日志

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/mini_mall_access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/mini_mall_error.log

# 后端日志（如果使用 PM2）
pm2 logs mini_mall_backend
```

## 🔍 故障排查

### 问题 1: 前端无法访问后端 API

**症状：** 浏览器控制台显示 CORS 错误或 404

**解决：**
1. 检查 Nginx 配置中的 `proxy_pass` 是否正确
2. 检查后端服务是否运行：`curl http://localhost:3000/api/health`
3. 检查 Nginx 错误日志：`sudo tail -f /var/log/nginx/mini_mall_error.log`

### 问题 2: 前端页面显示但 API 请求失败

**症状：** 页面加载正常，但商品列表等数据无法加载

**解决：**
1. 检查前端 `config.js` 中的 `API_BASE_URL` 是否为 `/api`
2. 打开浏览器开发者工具 → Network，查看 API 请求的 URL
3. 确认请求发送到 `/api/xxx` 而不是 `http://localhost:3000/api/xxx`

### 问题 3: 静态资源 404

**症状：** CSS、JS 文件无法加载

**解决：**
1. 检查前端文件路径：`ls -la /var/www/mini_mall/frontend/`
2. 检查 Nginx `root` 配置是否正确
3. 检查文件权限：`sudo chown -R www-data:www-data /var/www/mini_mall/frontend`

### 问题 4: 502 Bad Gateway

**症状：** Nginx 返回 502 错误

**解决：**
1. 检查后端服务是否运行：`pm2 list` 或 `systemctl status mini_mall`
2. 检查后端端口是否正确：`netstat -tulpn | grep 3000`
3. 检查后端日志：`pm2 logs mini_mall_backend`

## 📝 完整部署检查清单

- [ ] 后端服务已部署并运行在 localhost:3000（或 7891）
- [ ] 前端文件已上传到 `/var/www/mini_mall/frontend`
- [ ] 前端 `config.js` 中 `API_BASE_URL` 设置为 `/api`
- [ ] Nginx 已安装并配置
- [ ] Nginx 配置已测试：`sudo nginx -t`
- [ ] Nginx 已重载：`sudo systemctl reload nginx`
- [ ] 防火墙已开放 80 和 443 端口
- [ ] 后端端口（3000/7891）**未**对外开放（安全）
- [ ] 域名已解析到服务器 IP（如果使用域名）
- [ ] SSL 证书已配置（如果使用 HTTPS）
- [ ] 所有服务测试通过

## 🎯 总结

**关键点：**

1. ✅ **前端和后端可以部署在同一服务器**
2. ❌ **前端不能直接使用 `localhost` 访问后端**（浏览器中的 JS 无法访问服务器的 localhost）
3. ✅ **使用 Nginx 反向代理是最佳方案**
4. ✅ **前端使用相对路径 `/api`，由 Nginx 代理到后端**
5. ✅ **后端端口不需要对外开放，更安全**

这样部署后，用户只需访问一个域名（如 `http://your-domain.com`），前端和后端都通过这个域名访问，无需处理跨域问题。
