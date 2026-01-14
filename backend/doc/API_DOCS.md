# API 文档生成指南

本项目使用 **JSDoc** 自动生成 API 文档。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 生成文档

```bash
npm run docs
```

文档将生成在 `docs/api/` 目录下。

### 3. 查看文档

**方式 1: 使用 serve（推荐）**
```bash
npm run docs:serve
```

**方式 2: 直接打开**
```bash
open docs/api/index.html
```

## 📝 编写 API 文档注释

### 基本格式

```javascript
/**
 * 接口描述
 * @route METHOD /api/path
 * @group GroupName - 分组名称
 * @param {type} param.location.required - 参数描述
 * @returns {Object} statusCode - 响应描述
 * @example
 * // 请求示例
 * METHOD /api/path
 * { "param": "value" }
 */
```

### 参数类型

- `{string}` - 字符串
- `{number}` - 数字
- `{boolean}` - 布尔值
- `{Object}` - 对象
- `{Array}` - 数组
- `{Object[]}` - 对象数组

### 参数位置

- `param.body` - 请求体参数
- `param.query` - 查询参数
- `param.path` - 路径参数
- `param.header` - 请求头参数

### 参数属性

- `required` - 必需参数
- `optional` - 可选参数（默认）

### 完整示例

```javascript
/**
 * 创建订单接口
 * @route POST /api/orders
 * @group Orders - 订单相关接口
 * @param {Array} items.body.required - 商品列表
 * @param {string} items[].productId.body.required - 商品ID
 * @param {number} items[].quantity.body.required - 数量
 * @param {Object} shipping.body.required - 配送信息
 * @param {string} shipping.name.body.required - 收货人姓名
 * @param {string} shipping.phone.body.required - 联系电话
 * @param {string} shipping.address.body.required - 收货地址
 * @param {string} paymentMethod.body.required - 支付方式 (alipay|wechat|stripe)
 * @returns {Object} 201 - 订单创建成功
 * @returns {Object} 400 - 参数错误
 * @returns {Object} 401 - 未授权
 * @example
 * // 请求示例
 * POST /api/orders
 * Headers: {
 *   "Authorization": "Bearer token"
 * }
 * Body: {
 *   "items": [
 *     {
 *       "productId": "507f1f77bcf86cd799439011",
 *       "quantity": 2
 *     }
 *   ],
 *   "shipping": {
 *     "name": "张三",
 *     "phone": "13800138000",
 *     "address": "北京市朝阳区xxx"
 *   },
 *   "paymentMethod": "alipay"
 * }
 * 
 * // 成功响应示例
 * {
 *   "success": true,
 *   "message": "订单创建成功",
 *   "data": {
 *     "order": {
 *       "id": "507f1f77bcf86cd799439011",
 *       "orderNumber": "MM202401140001",
 *       "status": "pending"
 *     }
 *   }
 * }
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  // ...
}));
```

## 📂 文档结构

生成的文档结构:

```
docs/api/
├── index.html          # 文档首页
├── global.html        # 全局文档
├── scripts/           # 脚本文件
└── styles/           # 样式文件
```

## 🔧 配置说明

文档生成配置在 `jsdoc.json` 文件中:

```json
{
  "source": {
    "include": ["./src"],           // 包含的目录
    "includePattern": "\\.js$",     // 文件匹配模式
    "exclude": ["node_modules"]      // 排除的目录
  },
  "opts": {
    "destination": "./docs/api",    // 输出目录
    "recurse": true                 // 递归扫描
  }
}
```

## 📚 分组管理

使用 `@group` 标签对 API 进行分组:

```javascript
/**
 * @group Authentication - 认证相关接口
 */
```

常见分组:
- `Authentication` - 认证相关
- `Products` - 商品相关
- `Orders` - 订单相关
- `Payment` - 支付相关
- `Express` - 快递相关

## 🔄 更新文档

每次修改 API 后，重新生成文档:

```bash
npm run docs
```

## 📖 查看文档

生成的文档是静态 HTML 文件，可以:

1. **本地查看**: 直接在浏览器打开 `docs/api/index.html`
2. **服务器查看**: 使用 `npm run docs:serve`
3. **部署**: 将 `docs/api` 目录部署到静态服务器

## 🎨 文档主题

当前使用 `docdash` 主题，可以在 `jsdoc.json` 中配置其他主题。

## ✅ 检查清单

编写 API 注释时，确保包含:

- [ ] `@route` - 路由信息
- [ ] `@group` - 分组信息
- [ ] `@param` - 所有参数
- [ ] `@returns` - 响应信息
- [ ] `@example` - 使用示例

## 🔗 相关资源

- [JSDoc 官方文档](https://jsdoc.app/)
- [docdash 主题](https://github.com/clenemt/docdash)
- [JSDoc 标签参考](https://jsdoc.app/index.html#block-tags)
