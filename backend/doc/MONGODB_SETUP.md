# MongoDB 安装和启动指南

本指南提供多种方式在 macOS 上安装和启动 MongoDB。

## 🐳 方案一：使用 Docker（推荐，最简单）

### 优点
- 无需安装 MongoDB 到系统
- 易于管理和清理
- 不污染系统环境
- 可以快速启动和停止

### 步骤

#### 1. 启动 MongoDB 容器

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:latest
```

#### 2. 验证 MongoDB 运行

```bash
# 检查容器状态
docker ps | grep mongodb

# 查看日志
docker logs mongodb
```

#### 3. 停止 MongoDB

```bash
docker stop mongodb
```

#### 4. 启动已存在的容器

```bash
docker start mongodb
```

#### 5. 删除容器（可选）

```bash
# 停止并删除容器
docker stop mongodb
docker rm mongodb

# 删除数据卷（会丢失数据）
docker volume rm mongodb_data
```

### 常用 Docker 命令

```bash
# 查看所有容器
docker ps -a

# 进入 MongoDB 容器
docker exec -it mongodb mongosh

# 查看容器日志
docker logs -f mongodb

# 重启容器
docker restart mongodb
```

---

## 🍺 方案二：使用 Homebrew 安装

### 步骤

#### 1. 安装 MongoDB

```bash
# 添加 MongoDB tap
brew tap mongodb/brew

# 安装 MongoDB Community Edition
brew install mongodb-community
```

#### 2. 启动 MongoDB

**方式 A：使用 brew services（推荐，开机自启）**

```bash
# 启动 MongoDB 服务
brew services start mongodb-community

# 停止 MongoDB 服务
brew services stop mongodb-community

# 重启 MongoDB 服务
brew services restart mongodb-community

# 查看服务状态
brew services list
```

**方式 B：手动启动**

```bash
# 启动 MongoDB（前台运行）
mongod --config /opt/homebrew/etc/mongod.conf

# 或后台运行
mongod --config /opt/homebrew/etc/mongod.conf --fork
```

#### 3. 验证安装

```bash
# 检查 MongoDB 是否运行
ps aux | grep mongod

# 连接到 MongoDB
mongosh
```

#### 4. 配置文件位置

- 配置文件: `/opt/homebrew/etc/mongod.conf`
- 数据目录: `/opt/homebrew/var/mongodb`
- 日志文件: `/opt/homebrew/var/log/mongodb/mongo.log`

---

## ☁️ 方案三：使用 MongoDB Atlas（云服务，免费）

### 优点
- 无需本地安装
- 免费套餐可用
- 自动备份
- 易于团队协作

### 步骤

#### 1. 注册账号

访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

#### 2. 创建免费集群

1. 登录后点击 "Build a Database"
2. 选择免费套餐（M0）
3. 选择云服务商和区域（建议选择离你最近的）
4. 创建集群（需要几分钟）

#### 3. 配置网络访问

1. 在 "Network Access" 中添加 IP 地址
2. 开发环境可以添加 `0.0.0.0/0`（允许所有 IP，仅用于开发）

#### 4. 创建数据库用户

1. 在 "Database Access" 中创建用户
2. 设置用户名和密码（记住这些信息）

#### 5. 获取连接字符串

1. 点击 "Connect" 按钮
2. 选择 "Connect your application"
3. 复制连接字符串，格式如下：

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini_mall?retryWrites=true&w=majority
```

#### 6. 更新 .env 文件

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini_mall?retryWrites=true&w=majority
```

**注意**：将 `<username>` 和 `<password>` 替换为实际的值。

---

## 🚀 快速启动脚本

### Docker 方式（推荐）

创建 `start-mongodb.sh` 脚本：

```bash
#!/bin/bash

# 检查容器是否已存在
if docker ps -a | grep -q mongodb; then
    echo "启动已存在的 MongoDB 容器..."
    docker start mongodb
else
    echo "创建新的 MongoDB 容器..."
    docker run -d \
      --name mongodb \
      -p 27017:27017 \
      -v mongodb_data:/data/db \
      mongo:latest
fi

echo "MongoDB 已启动！"
echo "连接地址: mongodb://localhost:27017/mini_mall"
```

使用方式：

```bash
chmod +x start-mongodb.sh
./start-mongodb.sh
```

---

## ✅ 验证 MongoDB 连接

### 方法 1：使用 mongosh（MongoDB Shell）

```bash
# 如果使用 Docker
docker exec -it mongodb mongosh

# 如果使用 Homebrew 安装
mongosh

# 在 mongosh 中执行
show dbs
use mini_mall
db.stats()
```

### 方法 2：测试后端连接

启动后端服务器，查看日志：

```bash
cd backend
npm run dev
```

如果看到以下信息，说明连接成功：

```
✅ MongoDB 连接成功: localhost:27017
```

如果连接失败，会看到：

```
❌ MongoDB 连接失败: ...
```

---

## 🔧 常见问题

### 问题 1: 端口 27017 已被占用

**错误信息:**
```
Error: listen EADDRINUSE: address already in use :::27017
```

**解决方案:**

```bash
# 查找占用端口的进程
lsof -i :27017

# 或使用
sudo lsof -i :27017

# 停止占用端口的进程（替换 PID 为实际进程 ID）
kill -9 <PID>
```

### 问题 2: Docker 容器无法启动

**检查容器日志:**
```bash
docker logs mongodb
```

**删除并重新创建:**
```bash
docker stop mongodb
docker rm mongodb
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest
```

### 问题 3: Homebrew 安装失败

**更新 Homebrew:**
```bash
brew update
```

**清理缓存:**
```bash
brew cleanup
```

**重新安装:**
```bash
brew uninstall mongodb-community
brew install mongodb-community
```

### 问题 4: MongoDB Atlas 连接失败

1. 检查网络访问白名单是否包含你的 IP
2. 确认用户名和密码正确
3. 检查连接字符串格式是否正确
4. 确保集群已完全创建（可能需要几分钟）

---

## 📝 推荐方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Docker | 简单、隔离、易清理 | 需要 Docker | **开发环境推荐** |
| Homebrew | 原生安装、性能好 | 需要安装到系统 | 长期使用 |
| Atlas | 无需安装、自动备份 | 需要网络、有延迟 | 团队协作、生产环境 |

---

## 🎯 快速开始（Docker 方式）

如果你只想快速启动项目，推荐使用 Docker：

```bash
# 1. 启动 MongoDB
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest

# 2. 验证运行
docker ps | grep mongodb

# 3. 启动后端（在另一个终端）
cd backend
npm run dev
```

就这么简单！🎉
