# 后端项目说明

此目录用于存放后端源码。

## 📋 目录结构

```
backend/
├── src/              # 后端源代码
│   ├── server.js    # 服务器入口文件
│   ├── config/       # 配置文件
│   │   ├── database.js  # 数据库配置
│   │   ├── auth.js      # 认证配置
│   │   └── passport.js  # Passport 配置
│   ├── models/       # 数据模型
│   │   ├── User.js      # 用户模型
│   │   ├── Product.js   # 商品模型
│   │   └── Order.js     # 订单模型
│   ├── routes/       # 路由文件
│   │   ├── auth.js      # 认证路由
│   │   ├── products.js  # 商品路由
│   │   ├── orders.js   # 订单路由
│   │   ├── payment.js   # 支付路由
│   │   └── express.js   # 快递查询路由
│   └── middleware/   # 中间件
│       ├── auth.js      # 认证中间件
│       └── error.js     # 错误处理中间件
├── database/         # 数据库相关
│   └── seeds/        # 种子数据
│       └── products.js  # 商品种子数据
├── doc/              # 文档目录
│   ├── MONGODB_SETUP.md  # MongoDB 安装指南
│   ├── RUN.md            # 运行指南
│   ├── CODE_STYLE.md     # 代码规范指南
│   └── API_DOCS.md       # API 文档生成指南
├── docs/             # 生成的文档（gitignore）
│   └── api/          # API 文档
├── package.json      # 项目配置
├── .env.example      # 环境变量示例
├── .eslintrc.cjs     # ESLint 配置
├── .prettierrc.json  # Prettier 配置
├── jsdoc.json        # JSDoc 配置
├── start-mongodb.sh  # MongoDB 启动脚本
└── README.md         # 本文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下内容：
- `MONGODB_URI`: MongoDB 数据库连接地址
- `JWT_SECRET`: JWT 密钥
- `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`: Google OAuth 配置（可选）
- 支付相关配置（可选）

### 3. 启动 MongoDB

确保 MongoDB 服务正在运行。详细说明请查看 `doc/MONGODB_SETUP.md`。

**快速启动（使用 Docker，推荐）:**
```bash
./start-mongodb.sh
```

**其他方式:**
- 使用 Homebrew: `brew services start mongodb-community`
- 使用 MongoDB Atlas 云服务: 查看 `doc/MONGODB_SETUP.md`

### 4. 初始化数据库（可选）

运行种子脚本初始化商品数据：

```bash
node database/seeds/products.js
```

### 5. 启动服务器

开发模式（使用 nodemon，自动重启）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

## 📚 API 文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string
}
```

#### 用户登录
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
```

#### Google OAuth 登录
```
GET /api/auth/google
```

#### 获取当前用户信息
```
GET /api/auth/me
Headers: {
  Authorization: Bearer <token>
}
```

### 商品相关

#### 获取商品列表
```
GET /api/products?category=电子产品&sort=price_asc&page=1&limit=20
```

#### 获取商品详情
```
GET /api/products/:id
```

### 订单相关

#### 创建订单
```
POST /api/orders
Headers: {
  Authorization: Bearer <token>
}
Body: {
  items: Array<{productId, quantity}>,
  shipping: {name, phone, address, city, postalCode},
  paymentMethod: 'alipay' | 'wechat' | 'stripe'
}
```

#### 获取订单列表
```
GET /api/orders?page=1&limit=10&status=processing
Headers: {
  Authorization: Bearer <token>
}
```

#### 获取订单详情
```
GET /api/orders/:id
Headers: {
  Authorization: Bearer <token>
}
```

### 支付相关

#### 处理支付
```
POST /api/payment/process
Headers: {
  Authorization: Bearer <token>
}
Body: {
  orderId: string,
  paymentMethod: 'alipay' | 'wechat' | 'stripe'
}
```

### 快递查询相关

#### 查询快递信息
```
GET /api/express/track?trackingNumber=xxx&expressCompany=顺丰
Headers: {
  Authorization: Bearer <token>
}
```

#### 查询订单快递信息
```
GET /api/express/order/:orderId
Headers: {
  Authorization: Bearer <token>
}
```

## 🔧 技术栈

- **Node.js**: JavaScript 运行时
- **Express.js**: Web 框架
- **MongoDB**: 数据库
- **Mongoose**: MongoDB ODM
- **JWT**: 身份认证
- **Passport.js**: OAuth 认证
- **bcryptjs**: 密码加密
- **express-validator**: 请求验证

## 📝 待实现功能

1. **支付集成**
   - [ ] 支付宝支付 SDK 集成
   - [ ] 微信支付 SDK 集成
   - [ ] Stripe 支付 SDK 集成

2. **快递查询**
   - [ ] 快递100 API 集成
   - [ ] 菜鸟裹裹 API 集成

3. **管理后台**
   - [ ] 商品管理 API
   - [ ] 订单管理 API
   - [ ] 用户管理 API

4. **其他功能**
   - [ ] 邮件通知
   - [ ] 短信通知
   - [ ] 文件上传（商品图片）
   - [ ] 日志记录
   - [ ] 性能监控

## 🔒 安全注意事项

1. **生产环境配置**
   - 修改默认的 `JWT_SECRET`
   - 使用强密码
   - 启用 HTTPS
   - 配置 CORS 白名单

2. **数据库安全**
   - 使用 MongoDB 认证
   - 限制数据库访问 IP
   - 定期备份数据

3. **API 安全**
   - 实施速率限制
   - 验证所有输入
   - 使用 HTTPS
   - 定期更新依赖

## 📚 参考文档

- 前端 API 调用示例：查看 `frontend/src/scripts/auth.js`
- 支付接入：查看 `doc/PAYMENT_INTEGRATION.md`
- Google OAuth：查看 `doc/GOOGLE_OAUTH.md`
- 代码规范：查看 `doc/CODE_STYLE.md`
- API 文档生成：查看 `doc/API_DOCS.md`

## 🔧 开发工具

### 代码规范检查

```bash
# 检查代码规范
npm run lint

# 自动修复代码问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check

# 综合检查（lint + format）
npm run check
```

### API 文档生成

```bash
# 生成 API 文档
npm run docs

# 生成文档并启动本地服务器查看
npm run docs:serve
```

文档将生成在 `docs/api/` 目录下。

## 📋 代码规范

本项目遵循 **Google JavaScript 代码规范**：

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 JSDoc 生成 API 文档
- 所有函数必须包含 JSDoc 注释

详细说明请查看 `doc/CODE_STYLE.md`。

---

**注意**：此后端代码为初始版本，部分功能（如支付、快递查询）为模拟实现，需要根据实际需求集成相应的 SDK 和 API。
