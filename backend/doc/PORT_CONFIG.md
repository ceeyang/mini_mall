# 端口配置和防火墙设置指南

本文档说明如何配置服务器端口和防火墙，使外部可以访问后端服务。

## ⚠️ 重要说明

**端口号与开放状态无关！**

无论使用哪个端口（3000、7891 或其他），都需要：
1. **配置防火墙**：在服务器上开放对应端口
2. **配置安全组**：在云平台控制台配置安全组规则
3. **绑定到 0.0.0.0**：确保应用监听 `0.0.0.0:端口` 而不是 `127.0.0.1:端口`

**3000 端口并不比 7891 端口更特殊**，它们都需要相同的配置才能从外部访问。

## 🔍 问题诊断

### 1. 检查端口是否在监听

```bash
# 检查端口是否被占用
sudo lsof -i :7891
# 或
sudo netstat -tulpn | grep 7891
# 或
sudo ss -tulpn | grep 7891
```

如果看到进程在监听，说明应用已启动。

### 2. 检查本地访问

```bash
# 在服务器上测试本地访问
curl http://localhost:7891/health
```

如果本地可以访问，说明应用正常，问题在防火墙或安全组。

## 🔥 防火墙配置

### Ubuntu/Debian (UFW)

```bash
# 查看防火墙状态
sudo ufw status

# 如果防火墙未启用，先启用
sudo ufw enable

# 开放 7891 端口
sudo ufw allow 7891/tcp

# 如果需要开放 HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 查看规则



# 如果需要删除规则
sudo ufw delete allow 7891/tcp
```

### CentOS/RHEL (firewalld)

```bash
# 查看防火墙状态
sudo systemctl status firewalld

# 如果未运行，启动防火墙
sudo systemctl start firewalld
sudo systemctl enable firewalld

# 开放 7891 端口
sudo firewall-cmd --permanent --add-port=7891/tcp

# 如果需要开放 HTTP/HTTPS
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp

# 重新加载防火墙规则
sudo firewall-cmd --reload

# 查看开放的端口
sudo firewall-cmd --list-ports

# 如果需要删除规则
sudo firewall-cmd --permanent --remove-port=7891/tcp
sudo firewall-cmd --reload
```

### 使用 iptables（如果未使用 UFW 或 firewalld）

```bash
# 开放 7891 端口
sudo iptables -A INPUT -p tcp --dport 7891 -j ACCEPT

# 保存规则（Ubuntu/Debian）
sudo iptables-save | sudo tee /etc/iptables/rules.v4

# 保存规则（CentOS/RHEL）
sudo service iptables save
```

## ☁️ 云服务器安全组配置

### 阿里云 ECS

1. 登录阿里云控制台
2. 进入 **云服务器 ECS** → **实例**
3. 点击实例 ID → **安全组** → **配置规则**
4. 点击 **添加安全组规则**
5. 配置：
   - **规则方向**: 入方向
   - **授权策略**: 允许
   - **协议类型**: TCP
   - **端口范围**: 7891/7891
   - **授权对象**: 0.0.0.0/0（允许所有 IP）或指定 IP
6. 点击 **保存**

### 腾讯云 CVM

1. 登录腾讯云控制台
2. 进入 **云服务器** → **实例**
3. 点击实例 → **安全组** → **修改规则**
4. 点击 **添加规则**
5. 配置：
   - **类型**: 自定义
   - **来源**: 0.0.0.0/0 或指定 IP
   - **协议端口**: TCP:7891
   - **策略**: 允许
6. 点击 **完成**

### AWS EC2

1. 登录 AWS 控制台
2. 进入 **EC2** → **实例**
3. 选择实例 → **安全** → **安全组**
4. 点击安全组 ID
5. 点击 **入站规则** → **编辑入站规则**
6. 点击 **添加规则**
7. 配置：
   - **类型**: 自定义 TCP
   - **端口范围**: 7891
   - **来源**: 0.0.0.0/0 或指定 IP
8. 点击 **保存规则**

### 华为云 ECS

1. 登录华为云控制台
2. 进入 **弹性云服务器** → **实例**
3. 点击实例名称 → **安全组** → **更改安全组**
4. 点击安全组名称 → **入方向规则** → **添加规则**
5. 配置：
   - **协议端口**: TCP:7891
   - **源地址**: 0.0.0.0/0 或指定 IP
   - **描述**: 允许访问后端 API
6. 点击 **确定**

### 其他云平台

大多数云平台都有类似的安全组/防火墙配置，需要：
1. 找到安全组或防火墙设置
2. 添加入站规则
3. 允许 TCP 协议的 7891 端口
4. 设置源 IP（0.0.0.0/0 表示允许所有 IP）

## 🔒 安全建议

### 1. 限制源 IP（推荐）

不要使用 `0.0.0.0/0`，而是限制为：
- 你的办公网络 IP
- 前端服务器 IP
- 特定的 IP 段

```bash
# UFW 示例：只允许特定 IP
sudo ufw allow from 192.168.1.0/24 to any port 7891

# firewalld 示例：只允许特定 IP
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port protocol="tcp" port="7891" accept'
```

### 2. 使用 Nginx 反向代理（推荐）

不直接暴露 7891 端口，而是通过 Nginx 在 80/443 端口提供服务：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:7891;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

然后只开放 80/443 端口，关闭 7891 端口的公网访问。

### 3. 使用 VPN 或内网访问

将后端服务放在内网，只允许通过 VPN 或内网访问。

## 🧪 测试端口连通性

### 从本地测试

```bash
# 使用 telnet
telnet your-server-ip 7891

# 使用 nc (netcat)
nc -zv your-server-ip 7891

# 使用 curl
curl -v http://your-server-ip:7891/health

# 使用 nmap
nmap -p 7891 your-server-ip
```

### 从服务器测试

```bash
# 检查端口监听
sudo netstat -tulpn | grep 7891

# 测试本地访问
curl http://localhost:7891/health

# 检查防火墙规则
sudo ufw status  # Ubuntu/Debian
sudo firewall-cmd --list-all  # CentOS/RHEL
```

## 📋 完整检查清单

- [ ] 应用是否正在运行？
  ```bash
  pm2 status  # 或 docker ps
  ```

- [ ] 端口是否在监听？
  ```bash
  sudo netstat -tulpn | grep 7891
  ```

- [ ] 本地是否可以访问？
  ```bash
  curl http://localhost:7891/health
  ```

- [ ] 防火墙是否开放端口？
  ```bash
  sudo ufw status  # 或 sudo firewall-cmd --list-ports
  ```

- [ ] 云服务器安全组是否配置？
  - 检查云平台控制台的安全组设置

- [ ] 应用是否绑定到 0.0.0.0？
  - 确保应用监听 `0.0.0.0:7891` 而不是 `127.0.0.1:7891`

## 🔧 快速修复脚本

创建 `fix-port.sh`：

```bash
#!/bin/bash

PORT=7891

echo "🔧 配置端口 $PORT 访问..."

# 检测系统类型
if command -v ufw &> /dev/null; then
    echo "检测到 UFW 防火墙"
    sudo ufw allow $PORT/tcp
    sudo ufw reload
    echo "✅ UFW 已配置"
elif command -v firewall-cmd &> /dev/null; then
    echo "检测到 firewalld 防火墙"
    sudo firewall-cmd --permanent --add-port=$PORT/tcp
    sudo firewall-cmd --reload
    echo "✅ firewalld 已配置"
else
    echo "⚠️  未检测到防火墙管理工具，请手动配置"
fi

# 检查端口监听
echo ""
echo "📊 检查端口监听状态："
sudo netstat -tulpn | grep $PORT || echo "⚠️  端口未在监听"

# 测试本地访问
echo ""
echo "🧪 测试本地访问："
curl -s http://localhost:$PORT/health && echo "" || echo "❌ 本地访问失败"

echo ""
echo "💡 如果本地可以访问但外部无法访问，请检查："
echo "   1. 云服务器安全组配置"
echo "   2. 应用是否绑定到 0.0.0.0（而不是 127.0.0.1）"
```

使用：
```bash
chmod +x fix-port.sh
sudo ./fix-port.sh
```

## 📚 相关文档

- [直接部署指南](./DEPLOY_DIRECT.md)
- [Docker 部署指南](./DEPLOY_SERVER.md)
- [完整部署指南](../../doc/DEPLOY_GUIDE.md)
