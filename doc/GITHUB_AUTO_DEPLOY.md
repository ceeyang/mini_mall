# GitHub 自动部署指南

本指南介绍如何配置 GitHub 自动部署，当有新的提交推送到仓库时，自动拉取代码并重新构建部署。

## 方案一：GitHub Webhook（推荐）

### 优点
- 实时响应，推送后立即触发
- 不需要持续运行进程
- 更安全，支持签名验证

### 配置步骤

#### 1. 配置环境变量

**注意**：此脚本使用 Node.js 内置模块（http、crypto），无需安装额外依赖。

创建 `.env` 文件或设置环境变量：

```bash
export WEBHOOK_PORT=3001
export WEBHOOK_SECRET="your-secret-key-change-this"
export REPO_PATH="/path/to/mini_mall"
export WEBHOOK_BRANCH="main"  # 或 master
```

#### 3. 启动 Webhook 服务器

```bash
node github-webhook-server.js
```

或者使用 PM2 运行：

```bash
pm2 start github-webhook-server.js --name github-webhook
pm2 save
```

#### 4. 配置 GitHub Webhook

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Webhooks** → **Add webhook**
3. 配置以下信息：
   - **Payload URL**: `http://your-server-ip:3001/webhook`
   - **Content type**: `application/json`
   - **Secret**: 与脚本中的 `WEBHOOK_SECRET` 一致
   - **Events**: 选择 "Just the push event"
4. 点击 **Add webhook**

#### 5. 测试

向仓库推送一个提交，应该会看到服务器日志显示部署过程。

### 使用 PM2 管理

创建 `ecosystem-webhook.config.cjs`:

```javascript
module.exports = {
    apps: [
        {
            name: "github-webhook",
            script: "./github-webhook-server.js",
            instances: 1,
            autorestart: true,
            watch: false,
            env: {
                WEBHOOK_PORT: 3001,
                WEBHOOK_SECRET: "your-secret-key",
                REPO_PATH: process.cwd(),
                WEBHOOK_BRANCH: "main"
            }
        }
    ]
};
```

启动：

```bash
pm2 start ecosystem-webhook.config.cjs
```

## 方案二：轮询检查（简单）

### 优点
- 不需要配置 GitHub Webhook
- 不需要公网 IP
- 配置简单

### 缺点
- 不是实时响应，有延迟
- 需要持续运行进程

### 配置步骤

#### 1. 赋予执行权限

```bash
chmod +x github-poll.sh
```

#### 2. 配置变量（可选）

编辑脚本或使用环境变量：

```bash
export REPO_PATH="/path/to/mini_mall"
export GITHUB_BRANCH="main"
export CHECK_INTERVAL=60  # 检查间隔（秒）
```

#### 3. 运行脚本

**单次检查模式：**
```bash
./github-poll.sh --single
```

**后台运行模式：**
```bash
./github-poll.sh
```

**使用 nohup 后台运行：**
```bash
nohup ./github-poll.sh > /dev/null 2>&1 &
```

#### 4. 使用 systemd 管理（推荐）

创建 `/etc/systemd/system/github-poll.service`:

```ini
[Unit]
Description=GitHub Poll Auto Deploy
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/mini_mall
Environment="REPO_PATH=/path/to/mini_mall"
Environment="GITHUB_BRANCH=main"
Environment="CHECK_INTERVAL=60"
ExecStart=/path/to/mini_mall/github-poll.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

启用并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable github-poll
sudo systemctl start github-poll
sudo systemctl status github-poll
```

#### 5. 使用 cron 定期检查

编辑 crontab：

```bash
crontab -e
```

添加（每5分钟检查一次）：

```cron
*/5 * * * * /path/to/mini_mall/github-poll.sh --single >> /path/to/mini_mall/github-poll.log 2>&1
```

## 安全建议

### Webhook 方案

1. **使用 HTTPS**：如果可能，使用 Nginx 反向代理并配置 SSL
2. **更改密钥**：使用强随机密钥作为 `WEBHOOK_SECRET`
3. **防火墙**：只允许 GitHub IP 范围访问 webhook 端口
4. **IP 白名单**：在 Nginx 中配置 GitHub IP 白名单

### 轮询方案

1. **SSH 密钥**：使用 SSH 密钥而不是密码认证
2. **只读权限**：使用只读权限的部署密钥
3. **日志监控**：定期检查日志文件

## 故障排查

### Webhook 不工作

1. 检查服务器是否运行：`pm2 list` 或 `ps aux | grep webhook`
2. 检查端口是否开放：`netstat -tlnp | grep 3001`
3. 查看 GitHub Webhook 的交付历史，检查错误信息
4. 查看服务器日志

### 轮询不工作

1. 检查脚本是否运行：`ps aux | grep github-poll`
2. 检查日志文件：`tail -f github-poll.log`
3. 检查 git 配置：`git remote -v`
4. 手动执行单次检查：`./github-poll.sh --single`

### 部署失败

1. 检查网络连接
2. 检查 git 权限
3. 检查 npm 安装是否成功
4. 检查 PM2 状态：`pm2 list` 和 `pm2 logs`

## 高级配置

### 使用 Nginx 反向代理（Webhook）

在 Nginx 配置中添加：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /webhook {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 只部署特定分支

修改脚本中的分支检查逻辑，只监听特定分支（如 `production`、`main`）。

### 部署前备份

在部署脚本中添加备份逻辑：

```bash
# 备份当前版本
BACKUP_DIR="/backups/mini_mall"
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" "$REPO_PATH"
```

## 参考链接

- [GitHub Webhooks 文档](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [PM2 文档](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [systemd 服务配置](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
