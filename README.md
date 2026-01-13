# Mini Mall - 独立站最小单元

这是一个使用 HTML + Tailwind CSS + ES6 模块构建的独立站最小单元项目，采用模块化设计，符合 Google 前端开发规范。

## 📋 项目结构

```
mini_mall/
├── frontend/              # 前端代码目录
│   ├── index.html         # 首页（唯一在 frontend 根目录的页面）
│   ├── package.json       # 前端项目配置
│   ├── package-lock.json  # 依赖锁定文件
│   └── src/               # 前端源代码
│       ├── pages/         # 页面文件目录
│       │   ├── products.html      # 商品列表页
│       │   ├── cart.html          # 购物车页
│       │   ├── checkout.html      # 结算页
│       │   ├── login.html         # 登录/注册页
│       │   ├── user-center.html   # 用户中心/订单查询页
│       │   ├── about.html         # 关于我们页
│       │   └── contact.html       # 联系我们页
│       ├── components/    # 组件模块
│       │   ├── navbar.js  # 导航栏组件
│       │   ├── hero.js    # Hero 区域组件
│       │   ├── products.js # 商品展示组件
│       │   ├── products-list.js # 商品列表组件
│       │   ├── cart.js    # 购物车组件
│       │   ├── checkout.js # 结算组件
│       │   ├── login.js   # 登录/注册组件
│       │   ├── user-center.js # 用户中心组件
│       │   ├── about.js   # 关于我们组件
│       │   ├── contact.js # 联系我们组件
│       │   └── footer.js  # 页脚组件
│       ├── scripts/       # JavaScript 模块
│       │   ├── main.js    # 首页入口文件
│       │   ├── products-page.js # 商品页入口
│       │   ├── cart-page.js # 购物车页入口
│       │   ├── checkout-page.js # 结算页入口
│       │   ├── login-page.js # 登录页入口
│       │   ├── user-center-page.js # 用户中心页入口
│       │   ├── about-page.js # 关于我们页入口
│       │   ├── contact-page.js # 联系我们页入口
│       │   ├── cart.js    # 购物车管理模块
│       │   ├── auth.js    # 用户认证模块
│       │   ├── orders.js  # 订单管理模块
│       │   ├── payment.js # 支付服务模块
│       │   └── ui.js      # UI 交互模块
│       ├── styles/        # 样式文件
│       │   └── main.css   # 主样式文件
│       ├── data/          # 数据文件
│       │   └── products.js # 商品数据
│       └── assets/        # 静态资源
│           └── images/    # 图片资源
├── backend/               # 后端代码目录（预留）
│   ├── src/              # 后端源代码
│   ├── config/           # 配置文件
│   ├── models/           # 数据模型
│   ├── routes/           # 路由文件
│   ├── middleware/       # 中间件
│   ├── database/         # 数据库相关
│   └── README.md         # 后端说明文档
├── doc/                  # 文档目录
│   ├── DEPLOYMENT.md     # 详细部署文档
│   ├── QUICKSTART.md     # 快速开始指南
│   ├── ARCHITECTURE.md   # 架构文档
│   ├── PAYMENT_INTEGRATION.md # 支付接入指南
│   ├── GOOGLE_OAUTH.md   # Google OAuth 接入指南
│   └── DEPLOY_NOW.md     # 立即部署指南
├── vercel.json           # Vercel 部署配置
├── netlify.toml          # Netlify 部署配置
├── deploy.sh             # 部署脚本
├── .gitignore            # Git 忽略文件
├── .cursorrules          # Cursor 规则文件
└── README.md             # 项目文档（本文件）
```

## ✨ 功能特性

- ✅ **多页面架构**：首页、商品页、购物车页、结算页、登录页、用户中心独立页面
- ✅ **用户认证系统**：支持邮箱登录/注册和 Google OAuth 登录
- ✅ **订单管理**：订单创建、查询、状态跟踪
- ✅ **快递进度查询**：实时查看订单物流信息
- ✅ **模块化设计**：符合 Google 前端开发规范，代码结构清晰
- ✅ **完整购物车功能**：添加、查看、删除、更新数量、清空购物车
- ✅ **结算功能**：完整的订单提交和支付流程
- ✅ **支付渠道预留**：支持支付宝、微信支付、Stripe 接入
- ✅ **响应式设计**：支持移动端和桌面端，包含移动端汉堡菜单
- ✅ **现代化 UI**：使用 Tailwind CSS
- ✅ **ES6 模块**：使用原生 ES6 模块系统
- ✅ **本地存储**：购物车、用户信息、订单数据保存在 localStorage
- ✅ **平滑滚动导航**
- ✅ **无障碍访问支持**（prefers-reduced-motion）
- ✅ **SEO 友好的 HTML 结构**

## 📄 页面说明

### 页面列表

1. **首页（index.html）**
   - Hero 区域
   - 商品预览（3个商品）
   - 关于我们
   - 联系我们

2. **商品列表页（products.html）**
   - 完整的商品列表展示
   - 添加商品到购物车

3. **购物车页（cart.html）**
   - 查看购物车所有商品
   - 修改商品数量
   - 删除商品
   - 清空购物车
   - 跳转到结算页

4. **结算页（checkout.html）**
   - 需要登录后才能访问
   - 填写收货信息
   - 选择支付方式
   - 提交订单
   - 支付处理
   - 订单创建

5. **登录页（login.html）**
   - 邮箱登录/注册
   - Google OAuth 登录
   - 登录状态保持

6. **用户中心（user-center.html）**
   - 查看用户信息
   - 查看所有订单
   - 查看订单详情
   - 查询快递进度
   - 退出登录

## 🛒 购物车功能

### 已实现功能

- ✅ 添加商品到购物车
- ✅ 查看购物车（独立页面）
- ✅ 增加/减少商品数量
- ✅ 删除单个商品
- ✅ 清空购物车
- ✅ 实时更新购物车数量徽章
- ✅ 购物车总价计算
- ✅ 购物车数据持久化（localStorage）

### 购物车操作

1. **添加商品**：在商品卡片点击"加入购物车"按钮
2. **查看购物车**：点击导航栏的"购物车"按钮，跳转到购物车页面
3. **修改数量**：在购物车中使用 +/- 按钮调整数量
4. **删除商品**：点击商品右侧的删除按钮
5. **清空购物车**：点击"清空购物车"按钮
6. **去结算**：点击"去结算"按钮，跳转到结算页面

## 👤 用户认证功能

### 登录方式

- ✅ **邮箱登录/注册**：使用邮箱和密码登录或注册
- ✅ **Google OAuth 登录**：使用 Google 账号快速登录（预留接口）

### 用户功能

- ✅ 用户信息管理
- ✅ 登录状态保持（localStorage）
- ✅ 自动跳转（未登录访问受保护页面时跳转到登录页）

### Google OAuth 接入

详细的 Google OAuth 接入指南请查看 `doc/GOOGLE_OAUTH.md` 文件。

当前 Google 登录为模拟实现，实际接入时需要：
1. 在 Google Cloud Console 创建项目
2. 配置 OAuth 2.0 客户端 ID
3. 实现后端 API 验证 token
4. 替换模拟代码为真实 Google OAuth 流程

## 📦 订单管理功能

### 订单功能

- ✅ **订单创建**：结算时自动创建订单
- ✅ **订单查询**：在用户中心查看所有订单
- ✅ **订单详情**：查看订单完整信息
- ✅ **订单状态**：待支付、已支付、处理中、已发货、已送达、已取消

### 快递进度查询

- ✅ **快递单号**：订单发货后显示快递单号
- ✅ **物流跟踪**：查看快递实时状态
- ✅ **物流更新**：显示物流轨迹和时间节点
- ✅ **快递状态**：待发货、运输中、派送中、已送达

### 订单数据

订单数据保存在 localStorage 中，包含：
- 订单基本信息（ID、时间、状态）
- 商品列表
- 收货信息
- 支付信息
- 快递跟踪信息

## 💳 支付功能

### 支持的支付方式

- ✅ 支付宝（预留接口）
- ✅ 微信支付（预留接口）
- ✅ Stripe（预留接口）

### 支付接入

详细的支付接入指南请查看 `doc/PAYMENT_INTEGRATION.md` 文件。

当前支付功能为模拟实现，实际接入时需要：
1. 注册相应的支付平台账号
2. 配置支付参数
3. 实现后端 API
4. 替换模拟代码为真实支付接口

## 🚀 快速开始

### 本地开发

#### 方法 1: 使用 serve（推荐）

1. **安装依赖**（可选，用于本地预览）：
```bash
npm install
```

2. **启动本地服务器**：
```bash
npm run dev
# 或
npx serve . -p 3000
```

3. **访问网站**：
打开浏览器访问 `http://localhost:3000`

**重要**：由于使用了 ES6 模块，必须通过 HTTP 服务器访问，不能直接打开 `index.html` 文件。

#### 方法 2: 使用 Python（无需安装 Node.js）

```bash
# Python 3
python3 -m http.server 8000

# 或 Python 2
python -m SimpleHTTPServer 8000
```

然后访问 `http://localhost:8000`

#### 方法 3: 使用其他本地服务器

- **PHP**：`php -S localhost:8000`
- **Ruby**：`ruby -run -e httpd . -p 8000`

## 📦 部署指南

### 方法 1: 部署到 Vercel（推荐）

Vercel 自动支持 ES6 模块，无需额外配置。

#### 步骤 1: 准备代码仓库

1. **初始化 Git 仓库**（如果还没有）：
```bash
git init
git add .
git commit -m "Initial commit: Mini Mall独立站"
```

2. **推送到 GitHub**：
```bash
# 在 GitHub 创建新仓库，然后执行：
git remote add origin https://github.com/你的用户名/mini_mall.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 部署到 Vercel

1. 访问 [Vercel 官网](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择你的 `mini_mall` 仓库
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: 留空（静态站点无需构建）
   - **Output Directory**: 留空
6. 点击 "Deploy"
7. 等待部署完成（通常 1-2 分钟）
8. 获得你的网站链接，例如：`https://mini-mall.vercel.app`

### 方法 2: 部署到 Netlify

Netlify 同样支持 ES6 模块，配置与 Vercel 类似。

详细步骤请查看 `doc/DEPLOYMENT.md` 文件。

### 方法 3: 部署到 GitHub Pages

GitHub Pages 支持 ES6 模块，但需要确保所有路径都是相对路径（本项目已符合要求）。

详细步骤请查看 `doc/DEPLOYMENT.md` 文件。

## 🔧 代码结构说明

### 模块化设计

项目采用模块化设计，每个组件和功能都独立成文件：

- **组件（Components）**：负责渲染 HTML 和处理组件相关交互
- **脚本（Scripts）**：包含业务逻辑和工具函数
- **数据（Data）**：存储静态数据
- **样式（Styles）**：CSS 样式文件

### 主要模块

#### 购物车管理 (`src/scripts/cart.js`)

`CartManager` 类负责管理购物车的所有操作：

```javascript
import { cartManager } from './scripts/cart.js';

// 添加商品
cartManager.addItem(product, quantity);

// 获取购物车
const items = cartManager.getItems();

// 获取总价
const total = cartManager.getTotalPrice();
```

#### 组件系统

每个组件都遵循相同的模式：

```javascript
// 渲染函数：返回 HTML 字符串
export function renderComponent() {
  return `<div>...</div>`;
}

// 初始化函数：绑定事件监听器
export function initComponent() {
  // 事件处理
}
```

## 🎨 自定义配置

### 修改商品数据

编辑 `src/data/products.js` 文件：

```javascript
export const products = [
  {
    id: 1,
    name: '商品名称',
    description: '商品描述',
    price: 299,
    image: {
      gradient: 'from-indigo-400 to-purple-500'
    }
  },
  // 添加更多商品...
];
```

### 修改颜色主题

项目使用 Tailwind CSS，主要颜色为 `indigo`。要修改主题色：

1. 在组件文件中搜索 `indigo-600`、`indigo-700` 等
2. 替换为你想要的颜色，例如：
   - `blue-600` → 蓝色
   - `purple-600` → 紫色
   - `green-600` → 绿色
   - `red-600` → 红色

### 修改网站信息

编辑各个组件文件中的文本内容，例如：
- `src/components/navbar.js` - 网站名称
- `src/components/footer.js` - 联系信息

## 📱 响应式断点

项目使用 Tailwind CSS 的响应式设计：

- **移动端**: 默认（< 768px）
- **平板**: `md:` 前缀（≥ 768px）
- **桌面**: `lg:` 前缀（≥ 1024px）

## 🔍 SEO 优化建议

1. **添加更多 meta 标签**：
```html
<meta name="keywords" content="购物,电商,独立站">
<meta property="og:title" content="Mini Mall - 精品购物">
<meta property="og:description" content="发现精选商品，享受优质购物体验">
```

2. **添加网站图标**：
在 `index.html` 的 `<head>` 中添加：
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

3. **添加结构化数据**（JSON-LD）：
在 `<head>` 中添加结构化数据以帮助搜索引擎理解网站内容。

## 🐛 常见问题

### Q: 本地打开 index.html 后功能不工作？
A: 由于使用了 ES6 模块，必须通过 HTTP 服务器访问。使用 `npm run dev` 或 `python3 -m http.server 8000` 启动本地服务器。

### Q: 部署后页面样式丢失？
A: 检查网络连接，确保可以访问 Tailwind CDN。如果无法访问，可以考虑：
- 使用本地 Tailwind CSS 文件
- 使用其他 CDN（如 unpkg.com）
- 使用 Tailwind CLI 构建生产版本

### Q: 购物车数据丢失？
A: 购物车数据存储在浏览器的 localStorage 中。如果清除了浏览器数据，购物车会重置。

### Q: 如何添加更多商品？
A: 编辑 `src/data/products.js` 文件，添加新的商品对象到 `products` 数组。

## 📚 技术栈

- **HTML5**: 页面结构
- **Tailwind CSS**: 样式框架（通过 CDN）
- **JavaScript (ES6 Modules)**: 模块化 JavaScript
- **Google Fonts**: 字体（Inter）
- **localStorage**: 数据持久化

## 🔄 后续扩展建议

1. **后端 API**：集成商品管理、订单处理等功能
2. **使用框架**：迁移到 React、Vue 或 Next.js
3. **添加数据库**：存储商品、用户、订单数据
4. **支付集成**：接入支付宝、微信支付或 Stripe
5. **用户系统**：添加注册、登录、个人中心
6. **图片优化**：使用 WebP 格式，添加懒加载
7. **PWA 支持**：添加 Service Worker，支持离线访问
8. **搜索功能**：添加商品搜索功能
9. **商品分类**：添加商品分类和筛选功能
10. **订单管理**：实现完整的订单流程

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至：contact@minimall.com

---

**祝部署顺利！** 🎉
