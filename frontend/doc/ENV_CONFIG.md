# 前端环境配置说明

## 概述

前端项目实现了**开发/生产环境分离**的配置机制：

- **开发环境**：从 `.env` 文件加载配置
- **生产环境**：使用硬编码配置，不依赖 `.env` 文件

## 环境判断

系统通过 `hostname` 自动判断环境：

- **开发环境**：`localhost` 或 `127.0.0.1`
- **生产环境**：其他域名（如 `example.com`、`192.168.1.100` 等）

## 配置加载流程

### 开发环境

1. 加载 `load-env.js` 脚本
2. 检测到开发环境，尝试从 `.env` 文件加载配置
3. 将配置注入到 `window.ENV` 对象
4. `config.js` 从 `window.ENV` 读取配置
5. 如果 `.env` 不存在，使用默认值

### 生产环境

1. 加载 `load-env.js` 脚本
2. 检测到生产环境，**跳过** `.env` 文件加载
3. `config.js` 使用硬编码的生产环境配置
4. 不依赖任何外部配置文件

## 配置文件

### 开发环境配置（.env）

创建 `frontend/.env` 文件：

```env
# 后端 API 地址
API_BASE_URL=http://localhost:8080/api

# 前端 URL
FRONTEND_URL=http://localhost:3000
```

**注意**：`.env` 文件应该添加到 `.gitignore`，不要提交到版本控制。

### 生产环境配置（硬编码）

生产环境的配置直接写在代码中：

```javascript
const PRODUCTION_CONFIG = {
  API_BASE_URL: '/api',  // 相对路径，通过 Nginx 代理
  FRONTEND_URL: window.location.origin,  // 自动使用当前域名
};
```

## 配置优先级（开发环境）

开发环境中，配置的加载优先级：

1. **window.ENV**（从 `.env` 文件加载）
2. **meta 标签**（HTML 中的 meta 标签）
3. **localStorage**（浏览器本地存储）
4. **默认值**（代码中的默认值）

## 使用示例

### 在代码中使用配置

```javascript
import { config } from './config.js';

// 使用 API 基础 URL
const apiUrl = config.API_BASE_URL;
// 开发环境: http://localhost:8080/api
// 生产环境: /api

// 使用前端 URL
const frontendUrl = config.FRONTEND_URL;
// 开发环境: http://localhost:3000 (或 .env 中的值)
// 生产环境: 当前域名 (如 https://example.com)
```

### 检查当前环境

```javascript
import { isDevelopment } from './config.js';

if (isDevelopment()) {
  console.log('当前是开发环境');
} else {
  console.log('当前是生产环境');
}
```

## 部署注意事项

### 开发环境部署

1. 确保 `.env` 文件存在
2. 配置正确的 API 地址和端口
3. 启动开发服务器

### 生产环境部署

1. **不需要** `.env` 文件
2. 确保 Nginx 或其他反向代理正确配置
3. API 请求使用相对路径 `/api`
4. 前端 URL 自动使用当前域名

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name example.com;

    # 前端静态文件
    location / {
        root /path/to/frontend;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 常见问题

### Q: 为什么生产环境不使用 .env？

A: 
1. **安全性**：避免配置文件泄露
2. **简化部署**：不需要管理额外的配置文件
3. **性能**：减少文件读取操作
4. **一致性**：所有生产环境使用相同的硬编码配置

### Q: 如何修改生产环境配置？

A: 直接修改 `config.js` 中的 `PRODUCTION_CONFIG` 对象，然后重新构建和部署。

### Q: 开发环境如何测试生产环境配置？

A: 
1. 修改 hosts 文件，将域名指向 localhost
2. 或使用其他域名访问（如 `192.168.1.100`）
3. 系统会自动识别为生产环境

### Q: 如何添加新的配置项？

A: 
1. 在 `PRODUCTION_CONFIG` 中添加生产环境默认值
2. 在 `config` 对象中添加配置项
3. 在 `.env.example` 中添加示例值
4. 在 `getEnv()` 函数中添加获取逻辑（开发环境）

## 文件结构

```
frontend/
├── .env                    # 开发环境配置（不提交到 git）
├── .env.example            # 配置示例文件
├── load-env.js             # 环境变量加载脚本（仅开发环境加载）
├── src/
│   └── scripts/
│       └── config.js        # 配置模块（环境判断和配置加载）
└── doc/
    └── ENV_CONFIG.md        # 本文档
```

## 相关文档

- [配置缓存问题解决方案](./CONFIG_CACHE_FIX.md)
- [部署指南](../../doc/DEPLOYMENT.md)
