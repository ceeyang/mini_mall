# 后端项目说明

此目录用于存放后端源码。

## 📋 目录结构

```
backend/
├── src/              # 后端源代码
│   ├── app.js       # 应用入口文件
│   ├── server.js    # 服务器配置
│   └── ...
├── config/           # 配置文件
│   ├── database.js  # 数据库配置
│   ├── auth.js      # 认证配置
│   └── ...
├── models/          # 数据模型
│   ├── User.js      # 用户模型
│   ├── Product.js   # 商品模型
│   ├── Order.js     # 订单模型
│   └── ...
├── routes/          # 路由文件
│   ├── auth.js      # 认证路由
│   ├── products.js  # 商品路由
│   ├── orders.js    # 订单路由
│   └── ...
├── middleware/      # 中间件
│   ├── auth.js      # 认证中间件
│   ├── error.js     # 错误处理
│   └── ...
├── database/        # 数据库相关
│   ├── migrations/  # 数据库迁移
│   ├── seeds/       # 种子数据
│   └── ...
├── utils/           # 工具函数
├── tests/           # 测试文件
├── package.json     # 项目配置
└── README.md        # 本文件
```

## 🚀 技术栈建议

### Node.js 后端
- **框架**: Express.js / Koa.js / Fastify
- **数据库**: MongoDB / PostgreSQL / MySQL
- **ORM/ODM**: Mongoose / Sequelize / Prisma
- **认证**: JWT / Passport.js
- **API**: RESTful API / GraphQL

### Python 后端
- **框架**: Flask / FastAPI / Django
- **数据库**: PostgreSQL / MySQL / MongoDB
- **ORM**: SQLAlchemy / Django ORM
- **认证**: JWT / OAuth2

## 📝 待实现功能

1. **用户认证 API**
   - 邮箱登录/注册
   - Google OAuth 验证
   - JWT token 生成和验证

2. **商品管理 API**
   - 商品 CRUD 操作
   - 商品分类管理
   - 商品搜索

3. **订单管理 API**
   - 订单创建
   - 订单查询
   - 订单状态更新

4. **支付集成 API**
   - 支付宝支付接口
   - 微信支付接口
   - Stripe 支付接口

5. **快递查询 API**
   - 快递单号录入
   - 快递状态查询
   - 物流轨迹更新

## 🔧 环境配置

创建 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DATABASE_URL=mongodb://localhost:27017/mini_mall
# 或
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_mall
DB_USER=your_user
DB_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 支付配置
ALIPAY_APP_ID=your-alipay-app-id
ALIPAY_PRIVATE_KEY=your-private-key
WECHAT_APP_ID=your-wechat-app-id
WECHAT_MCH_ID=your-mch-id
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## 📚 参考文档

- 前端 API 调用示例：查看 `frontend/src/scripts/auth.js`
- 支付接入：查看 `doc/PAYMENT_INTEGRATION.md`
- Google OAuth：查看 `doc/GOOGLE_OAUTH.md`

---

**注意**：此目录目前为空，等待后端开发时使用。
