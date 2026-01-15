# 服务器直接部署指南（非 Docker）

本文档说明如何在服务器上直接部署 Mini Mall 后端服务（不使用 Docker）。

## 📋 前置要求

- 服务器已安装 Node.js 18+ 和 npm
- 服务器已安装 MongoDB 或已配置 MongoDB Atlas 连接
- 服务器有 root 或 sudo 权限
- 服务器可以访问互联网（用于安装依赖）

## 🚀 部署步骤

### 步骤 1: 准备服务器环境

#### 1.1 安装 Node.js（如果未安装）

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version
```

#### 1.2 安装 PM2（进程管理器）

```bash
sudo npm install -g pm2
```

### 步骤 2: 上传代码到服务器

#### 方法一：使用 Git（推荐）

```bash
# 在服务器上克隆仓库
cd /opt
sudo git clone https://github.com/your-username/mini_mall.git
cd mini_mall/backend
```

#### 方法二：使用 SCP 上传

```bash
# 在本地打包
cd /path/to/mini_mall
tar -czf backend.tar.gz backend/

# 上传到服务器
scp backend.tar.gz user@server:/opt/

# 在服务器上解压
ssh user@server
cd /opt
tar -xzf backend.tar.gz
cd backend
```

### 步骤 3: 安装依赖

```bash
cd /opt/mini_mall/backend
npm install --production
```

### 步骤 4: 配置环境变量

```bash
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

# 设置文件权限（保护敏感信息）
chmod 600 .env
```

### 步骤 5: 初始化数据库

```bash
# 初始化商品数据
npm run db:init:force
```

### 步骤 6: 使用 PM2 启动服务

```bash
# 启动应用
pm2 start src/server.js --name mini-mall-backend

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 执行输出的命令（通常是 sudo env PATH=... pm2 startup systemd -u user --hp /home/user）
```

### 步骤 7: 配置 Nginx 反向代理（可选）

#### 7.1 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

#### 7.2 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/mini-mall-backend
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # 如果需要 HTTPS，取消注释以下配置
    # listen 443 ssl;
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;

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
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 健康检查端点
    location /health {
        proxy_pass http://localhost:7891/health;
        access_log off;
    }
}
```

#### 7.3 启用配置

```bash
# Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/mini-mall-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# CentOS/RHEL
sudo cp /etc/nginx/sites-available/mini-mall-backend /etc/nginx/conf.d/mini-mall-backend.conf
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 PM2 管理命令

### 查看应用状态

```bash
pm2 status
pm2 info mini-mall-backend
```

### 查看日志

```bash
# 实时日志
pm2 logs mini-mall-backend

# 查看最近 100 行
pm2 logs mini-mall-backend --lines 100

# 清空日志
pm2 flush
```

### 重启应用

```bash
pm2 restart mini-mall-backend
```

### 停止应用

```bash
pm2 stop mini-mall-backend
```

### 删除应用

```bash
pm2 delete mini-mall-backend
```

### 监控

```bash
# 实时监控
pm2 monit

# 查看详细信息
pm2 show mini-mall-backend
```

## 🔄 更新部署

### 方法一：使用 Git

```bash
cd /opt/mini_mall/backend
git pull origin main
npm install --production
pm2 restart mini-mall-backend
```

### 方法二：手动更新

```bash
# 1. 停止应用
pm2 stop mini-mall-backend

# 2. 备份当前代码
cd /opt/mini_mall
cp -r backend backend.backup

# 3. 上传新代码（使用 SCP 或其他方式）

# 4. 安装依赖
cd backend
npm install --production

# 5. 重启应用
pm2 restart mini-mall-backend
```

## 🔐 安全配置

### 1. 防火墙配置

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 7891/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=7891/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 2. 使用非 root 用户运行

```bash
# 创建专用用户
sudo useradd -m -s /bin/bash mini-mall
sudo chown -R mini-mall:mini-mall /opt/mini_mall

# 切换到该用户
sudo su - mini-mall
cd /opt/mini_mall/backend
pm2 start src/server.js --name mini-mall-backend
```

### 3. 配置 SSL/TLS（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d api.yourdomain.com

# 自动续期（已自动配置）
sudo certbot renew --dry-run
```

## 📊 监控和日志

### 配置日志轮转

创建 `/etc/logrotate.d/mini-mall-backend`：

```
/root/.pm2/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    create 0640 root root
}
```

### 使用 systemd 服务（替代 PM2）

创建 `/etc/systemd/system/mini-mall-backend.service`：

```ini
[Unit]
Description=Mini Mall Backend Service
After=network.target

[Service]
Type=simple
User=mini-mall
WorkingDirectory=/opt/mini_mall/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=mini-mall-backend

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable mini-mall-backend
sudo systemctl start mini-mall-backend
sudo systemctl status mini-mall-backend
```

## 🐛 故障排查

### 应用无法启动

```bash
# 检查 Node.js 版本
node --version

# 检查依赖是否安装
npm list --depth=0

# 手动运行查看错误
cd /opt/mini_mall/backend
node src/server.js
```

### 端口被占用

```bash
# 查看端口占用
sudo lsof -i :7891
# 或
sudo netstat -tulpn | grep 7891

# 杀死占用进程
sudo kill -9 <PID>
```

### 数据库连接失败

```bash
# 检查环境变量
cd /opt/mini_mall/backend
cat .env | grep MONGODB_URI

# 测试连接
node -e "require('./src/config/database.js').connectDB().then(() => process.exit(0)).catch(e => {console.error(e); process.exit(1)})"
```

### 查看 PM2 错误日志

```bash
pm2 logs mini-mall-backend --err
```

## 📝 完整部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

set -e

APP_DIR="/opt/mini_mall/backend"
APP_NAME="mini-mall-backend"
NODE_VERSION="20"

echo "🚀 开始部署 Mini Mall Backend..."

# 1. 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js $NODE_VERSION+"
    exit 1
fi

# 2. 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    sudo npm install -g pm2
fi

# 3. 进入应用目录
cd $APP_DIR

# 4. 安装依赖
echo "📦 安装依赖..."
npm install --production

# 5. 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，请先创建并配置环境变量"
    exit 1
fi

# 6. 初始化数据库（可选）
read -p "是否初始化数据库？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:init:force
fi

# 7. 停止旧进程（如果存在）
if pm2 list | grep -q "$APP_NAME"; then
    echo "🛑 停止旧进程..."
    pm2 stop $APP_NAME
    pm2 delete $APP_NAME
fi

# 8. 启动应用
echo "▶️  启动应用..."
pm2 start src/server.js --name $APP_NAME

# 9. 保存 PM2 配置
pm2 save

# 10. 显示状态
echo "✅ 部署完成！"
echo ""
pm2 status
echo ""
echo "📝 查看日志：pm2 logs $APP_NAME"
echo "🔍 健康检查：curl http://localhost:7891/health"
```

使用脚本：

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

## 🔄 自动化部署（CI/CD）

### GitHub Actions 示例

```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/mini_mall/backend
            git pull origin main
            npm install --production
            pm2 restart mini-mall-backend
```

## 📚 相关文档

- [Docker 部署指南](./DEPLOY_SERVER.md)
- [端口配置指南](./PORT_CONFIG.md)
- [完整部署指南](../../doc/DEPLOY_GUIDE.md)
