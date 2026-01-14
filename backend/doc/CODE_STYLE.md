# 代码规范指南

本项目遵循 **Google JavaScript 代码规范**，使用 ESLint 和 Prettier 进行代码检查和格式化。

## 📋 规范要求

### 基本规则

1. **缩进**: 使用 2 个空格
2. **引号**: 使用单引号
3. **分号**: 必须使用分号
4. **行长度**: 最大 100 个字符
5. **函数注释**: 所有函数必须包含 JSDoc 注释

### 命名规范

- **变量和函数**: 使用 `camelCase`
- **常量**: 使用 `UPPER_SNAKE_CASE`
- **类**: 使用 `PascalCase`
- **文件名**: 使用 `kebab-case` 或 `camelCase`

### 代码格式示例

```javascript
/**
 * 示例函数
 * @param {string} name - 名称
 * @param {number} age - 年龄
 * @returns {Object} 用户对象
 */
function createUser(name, age) {
  const user = {
    name: name,
    age: age,
    createdAt: new Date(),
  };
  return user;
}
```

## 🛠️ 工具使用

### ESLint - 代码检查

**检查代码:**
```bash
npm run lint
```

**自动修复:**
```bash
npm run lint:fix
```

### Prettier - 代码格式化

**格式化代码:**
```bash
npm run format
```

**检查格式:**
```bash
npm run format:check
```

### 综合检查

**同时运行 ESLint 和 Prettier 检查:**
```bash
npm run check
```

## 📝 JSDoc 注释规范

### 文件头注释

```javascript
/**
 * @fileoverview 文件描述
 * @module routes/auth
 * @author 作者名
 */
```

### 函数注释

```javascript
/**
 * 函数描述
 * @param {string} param1 - 参数1描述
 * @param {number} [param2] - 可选参数2描述
 * @returns {Object} 返回值描述
 * @throws {Error} 错误描述
 * @example
 * // 使用示例
 * exampleFunction('value', 123);
 */
function exampleFunction(param1, param2) {
  // ...
}
```

### API 路由注释

```javascript
/**
 * API 接口描述
 * @route POST /api/endpoint
 * @group GroupName - 分组名称
 * @param {string} param.body.required - 参数描述
 * @returns {Object} 200 - 成功响应
 * @returns {Object} 400 - 错误响应
 * @example
 * // 请求示例
 * POST /api/endpoint
 * { "param": "value" }
 */
router.post('/endpoint', handler);
```

## 🔍 编辑器配置

### VS Code

安装以下扩展:
- ESLint
- Prettier - Code formatter

在 `.vscode/settings.json` 中添加:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript"
  ]
}
```

## 📚 参考资源

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [JSDoc 文档](https://jsdoc.app/)
- [Prettier 配置](https://prettier.io/docs/en/configuration.html)

## ✅ 提交前检查清单

- [ ] 运行 `npm run check` 通过
- [ ] 所有函数都有 JSDoc 注释
- [ ] API 路由都有完整的文档注释
- [ ] 代码已格式化
- [ ] 没有 ESLint 错误
