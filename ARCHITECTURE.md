# 项目架构文档

本文档说明 Mini Mall 项目的架构设计和代码组织方式。

## 📐 架构设计

### 设计原则

1. **模块化**：每个功能独立成模块，便于维护和扩展
2. **组件化**：UI 组件与业务逻辑分离
3. **可扩展性**：易于添加新功能和组件
4. **符合规范**：遵循 Google 前端开发规范

### 目录结构

```
src/
├── components/        # UI 组件模块
│   ├── navbar.js     # 导航栏组件
│   ├── hero.js       # Hero 区域组件
│   ├── products.js   # 商品展示组件
│   ├── cart.js       # 购物车组件
│   ├── about.js      # 关于我们组件
│   ├── contact.js    # 联系我们组件
│   └── footer.js     # 页脚组件
├── scripts/          # JavaScript 业务逻辑
│   ├── main.js       # 主入口文件
│   ├── cart.js       # 购物车管理模块
│   └── ui.js         # UI 交互模块
├── styles/           # 样式文件
│   └── main.css      # 主样式文件
├── data/             # 数据文件
│   └── products.js   # 商品数据
└── assets/           # 静态资源
    └── images/       # 图片资源
```

## 🧩 模块说明

### 组件模块 (Components)

组件模块负责渲染 HTML 和处理组件相关的交互。

#### 组件模式

每个组件都遵循相同的模式：

```javascript
/**
 * 组件名称
 * 组件描述
 */

// 导入依赖
import { ... } from '...';

/**
 * 渲染函数：生成组件的 HTML
 * @returns {string} HTML 字符串
 */
export function renderComponent() {
  return `<div>...</div>`;
}

/**
 * 初始化函数：绑定事件监听器
 */
export function initComponent() {
  // 事件处理逻辑
}
```

#### 组件列表

1. **navbar.js** - 导航栏组件
   - 渲染导航栏
   - 处理购物车按钮点击
   - 更新购物车数量徽章

2. **hero.js** - Hero 区域组件
   - 渲染首页 Hero 区域

3. **products.js** - 商品展示组件
   - 渲染商品列表
   - 处理"加入购物车"按钮点击

4. **cart.js** - 购物车组件
   - 渲染购物车界面
   - 处理购物车所有操作（增删改查）

5. **about.js** - 关于我们组件
   - 渲染关于我们区域

6. **contact.js** - 联系我们组件
   - 渲染联系表单

7. **footer.js** - 页脚组件
   - 渲染页脚信息

### 脚本模块 (Scripts)

脚本模块包含业务逻辑和工具函数。

#### main.js - 主入口文件

负责初始化所有组件和模块：

```javascript
import { renderNavbar, initNavbar } from '../components/navbar.js';
// ... 其他导入

function initApp() {
  // 渲染所有组件
  // 初始化所有交互
}
```

#### cart.js - 购物车管理模块

`CartManager` 类负责管理购物车的所有操作：

- `addItem(product, quantity)` - 添加商品
- `removeItem(productId)` - 删除商品
- `updateQuantity(productId, quantity)` - 更新数量
- `clearCart()` - 清空购物车
- `getItems()` - 获取所有商品
- `getTotalItems()` - 获取商品总数
- `getTotalPrice()` - 获取总价
- `isEmpty()` - 检查是否为空
- `onCartChange(callback)` - 注册变化监听器

数据持久化使用 `localStorage`。

#### ui.js - UI 交互模块

包含通用的 UI 交互功能：

- `initSmoothScroll()` - 初始化平滑滚动
- `initFormHandling()` - 初始化表单处理
- `showNotification(message, type)` - 显示通知消息

### 数据模块 (Data)

#### products.js - 商品数据

存储所有商品信息：

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
  // ...
];
```

### 样式模块 (Styles)

#### main.css - 主样式文件

包含全局样式和自定义样式：

- 字体设置
- 平滑滚动
- 无障碍支持（prefers-reduced-motion）
- 通知动画

## 🔄 数据流

### 购物车数据流

```
用户操作
  ↓
组件事件处理 (products.js, cart.js)
  ↓
CartManager (cart.js)
  ↓
localStorage (持久化)
  ↓
通知监听器
  ↓
更新 UI (navbar.js, cart.js)
```

### 组件渲染流程

```
index.html
  ↓
main.js (初始化)
  ↓
渲染所有组件
  ↓
初始化组件交互
  ↓
绑定事件监听器
```

## 🎯 设计模式

### 1. 模块模式

使用 ES6 模块系统实现模块化：

```javascript
// 导出
export function renderComponent() { ... }

// 导入
import { renderComponent } from './component.js';
```

### 2. 单例模式

`CartManager` 使用单例模式，确保全局只有一个购物车实例：

```javascript
export const cartManager = new CartManager();
```

### 3. 观察者模式

购物车使用观察者模式，当购物车变化时通知所有监听器：

```javascript
cartManager.onCartChange(() => {
  // 更新 UI
});
```

### 4. 组件模式

每个组件都遵循相同的接口：

- `render*()` - 渲染函数
- `init*()` - 初始化函数

## 📦 依赖关系

```
index.html
  └── src/scripts/main.js
      ├── components/navbar.js
      │   └── scripts/cart.js
      ├── components/hero.js
      ├── components/products.js
      │   ├── data/products.js
      │   └── scripts/cart.js
      ├── components/cart.js
      │   ├── scripts/cart.js
      │   └── scripts/ui.js
      ├── components/about.js
      ├── components/contact.js
      ├── components/footer.js
      └── scripts/ui.js
```

## 🚀 扩展指南

### 添加新组件

1. 在 `src/components/` 创建新文件
2. 实现 `render*()` 和 `init*()` 函数
3. 在 `src/scripts/main.js` 中导入并初始化

### 添加新功能

1. 在 `src/scripts/` 创建新模块
2. 实现相关功能
3. 在需要的地方导入使用

### 修改商品数据

编辑 `src/data/products.js` 文件，修改 `products` 数组。

## 🔒 最佳实践

1. **单一职责**：每个模块只负责一个功能
2. **低耦合**：模块之间通过明确的接口通信
3. **高内聚**：相关功能组织在一起
4. **可复用**：组件和函数设计为可复用
5. **可测试**：函数设计为易于测试

## 📝 代码规范

1. **命名规范**：
   - 组件文件：小写 + 连字符（如 `navbar.js`）
   - 函数名：驼峰命名（如 `renderNavbar`）
   - 常量：大写 + 下划线（如 `MAX_ITEMS`）

2. **注释规范**：
   - 每个文件顶部有文件说明
   - 每个函数有 JSDoc 注释
   - 复杂逻辑有行内注释

3. **代码组织**：
   - 导入语句在文件顶部
   - 导出语句在文件底部
   - 相关功能组织在一起

---

**遵循这些规范，保持代码质量和可维护性！** 🎉
