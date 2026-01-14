# 数据库初始化指南

本文档说明如何初始化 MongoDB 数据库，包括创建集合和导入初始数据。

## 📋 前提条件

1. **MongoDB 已连接**
   - 本地 MongoDB 或 MongoDB Atlas
   - 连接字符串已配置在 `backend/.env` 文件中

2. **环境变量已配置**
   ```bash
   cd backend
   cp .env.example .env
   # 编辑 .env 文件，配置 MONGODB_URI
   ```

## 🚀 方法一：使用初始化脚本（推荐）

### 步骤 1: 运行初始化脚本

```bash
cd backend
npm run db:init
```

或者直接运行：

```bash
cd backend
node database/init-db.js
```

### 步骤 2: 查看结果

脚本会自动：
1. 连接数据库
2. 检查是否已有数据
3. 从 `products-import.json` 导入商品数据（如果文件存在）
4. 或使用种子数据导入
5. 显示统计信息

### 输出示例

```
🚀 开始初始化数据库...

📡 正在连接数据库...
✅ 数据库连接成功

📦 准备导入 20 个商品...
✅ 成功导入 20 个商品

📊 数据库统计信息：
   - 商品总数: 20
   - 分类数量: 3
   - 分类列表: 电子产品, 家居用品, 服装配饰

✅ 数据库初始化完成！
```

---

## 🚀 方法二：使用种子脚本

### 步骤 1: 运行种子脚本

```bash
cd backend
npm run db:seed
```

或者直接运行：

```bash
cd backend
node database/seeds/products.js
```

### 说明

- 会导入 9 个示例商品
- 如果数据库中已有商品，不会重复导入

---

## 🚀 方法三：使用 MongoDB Compass 导入 JSON

### 步骤 1: 打开 MongoDB Compass

1. 连接到你的 MongoDB（本地或 Atlas）
2. 选择数据库：`mini_mall`

### 步骤 2: 导入商品数据

1. 在左侧选择 `mini_mall` 数据库
2. 点击 "Collections" 标签
3. 如果 `products` 集合不存在，会自动创建
4. 点击 "Add Data" → "Import File"
5. 选择文件：`backend/database/products-import.json`
6. 选择格式：JSON
7. 点击 "Import"

### 步骤 3: 验证数据

导入后，你应该能看到 20 个商品文档。

---

## 🚀 方法四：使用 MongoDB Shell (mongosh)

### 步骤 1: 连接到数据库

**本地 MongoDB:**
```bash
mongosh mongodb://localhost:27017/mini_mall
```

**MongoDB Atlas:**
```bash
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini_mall"
```

### 步骤 2: 导入数据

```javascript
// 切换到数据库
use mini_mall

// 查看当前集合
show collections

// 注意：MongoDB Shell 不能直接导入 JSON 文件
// 需要使用 mongoimport 命令（见方法五）
```

---

## 🚀 方法五：使用 mongoimport 命令

### 步骤 1: 安装 MongoDB Database Tools

如果还没有安装：

**macOS:**
```bash
brew install mongodb-database-tools
```

**其他系统:**
访问 https://www.mongodb.com/try/download/database-tools

### 步骤 2: 导入数据

**本地 MongoDB:**
```bash
cd backend/database
mongoimport --uri="mongodb://localhost:27017/mini_mall" \
  --collection=products \
  --file=products-import.json \
  --jsonArray
```

**MongoDB Atlas:**
```bash
cd backend/database
mongoimport --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini_mall" \
  --collection=products \
  --file=products-import.json \
  --jsonArray
```

**注意**：将 `username`、`password` 和 `cluster0.xxxxx` 替换为实际值。

---

## 📊 验证数据

### 方法 1: 使用 MongoDB Compass

1. 打开 MongoDB Compass
2. 连接到数据库
3. 选择 `mini_mall` 数据库
4. 查看 `products` 集合
5. 应该能看到商品数据

### 方法 2: 使用后端 API

启动后端服务后，访问：

```bash
# 获取商品列表
curl http://localhost:3000/api/products

# 或使用浏览器访问
http://localhost:3000/api/products
```

### 方法 3: 使用 MongoDB Shell

```javascript
use mini_mall
db.products.find().pretty()
db.products.countDocuments()
```

---

## 🔄 重新导入数据

如果需要清空并重新导入数据：

### 方法 1: 使用 MongoDB Compass

1. 在 `products` 集合中
2. 点击 "Delete" 按钮
3. 选择删除所有文档
4. 重新导入数据

### 方法 2: 使用 MongoDB Shell

```javascript
use mini_mall
db.products.deleteMany({})
// 然后重新运行初始化脚本
```

### 方法 3: 修改初始化脚本

编辑 `backend/database/init-db.js`，取消注释清空数据的代码：

```javascript
// 清空现有商品
await Product.deleteMany({});
```

然后重新运行：

```bash
npm run db:init
```

---

## 📋 数据说明

### 商品数据

- **来源 1**: `backend/database/products-import.json`（20 个商品）
- **来源 2**: `backend/database/seeds/products.js`（9 个商品）

### 集合说明

MongoDB 会在首次插入数据时自动创建集合：

- `products` - 商品集合
- `users` - 用户集合（注册用户时自动创建）
- `orders` - 订单集合（创建订单时自动创建）
- `contacts` - 留言集合（提交留言时自动创建）

---

## ⚠️ 常见问题

### Q1: 运行脚本时提示 "MongoDB 连接失败"

**A:** 检查：
1. `backend/.env` 文件中的 `MONGODB_URI` 是否正确
2. MongoDB 服务是否运行（本地）或网络访问是否配置（Atlas）
3. 连接字符串中的用户名和密码是否正确

### Q2: 导入时提示 "集合已存在"

**A:** 这是正常的，MongoDB 会自动创建集合。如果已有数据，脚本会跳过导入。

### Q3: 如何清空所有数据重新导入？

**A:** 
1. 使用 MongoDB Compass 删除集合
2. 或使用 MongoDB Shell：`db.products.deleteMany({})`
3. 然后重新运行初始化脚本

### Q4: 导入的数据格式不正确？

**A:** 检查 JSON 文件格式：
- 必须是有效的 JSON 数组
- 每个商品对象必须包含必需字段（name, description, price, category）
- 日期字段使用 ISO 8601 格式

### Q5: 如何导入自定义数据？

**A:**
1. 准备 JSON 文件，格式参考 `products-import.json`
2. 将文件放在 `backend/database/` 目录
3. 修改 `init-db.js` 中的文件路径
4. 运行初始化脚本

---

## 📝 下一步

数据库初始化完成后：

1. **启动后端服务**：
   ```bash
   cd backend
   npm run dev
   ```

2. **测试 API**：
   ```bash
   curl http://localhost:3000/api/products
   ```

3. **查看数据**：
   - 使用 MongoDB Compass
   - 或访问前端页面查看商品列表

---

## 🔗 相关文档

- [MongoDB 安装指南](MONGODB_SETUP.md)
- [后端运行指南](RUN.md)
- [API 文档](API_DOCS.md)

---

**初始化愉快！** 🎉
