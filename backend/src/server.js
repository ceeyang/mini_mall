/**
 * 服务器入口文件
 * 启动 Express 服务器并配置中间件
 */

import cors from 'cors';
import express from 'express';
// 导入环境变量加载器（会自动加载）
import { connectDB } from './config/database.js';
import './config/env-loader.js';
import { errorHandler } from './middleware/error.js';
import { requestLogger } from './middleware/logger.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import expressRoutes from './routes/express.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import productRoutes from './routes/products.js';

// 环境变量已在 env-loader.js 中加载

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// 连接数据库
connectDB();

// 中间件配置
// 请求日志中间件（放在最前面，记录所有请求）
app.use(requestLogger);

// CORS 配置：允许前端跨域请求
app.use(cors({
  origin: function (origin, callback) {
    // 允许无 origin 的请求（如 Postman、移动应用等）
    if (!origin) {
      return callback(null, true);
    }

    // 允许配置的前端地址
    if (FRONTEND_URL === '*' || origin === FRONTEND_URL) {
      return callback(null, true);
    }

    // 开发环境：允许 localhost 的任意端口（方便调试）
    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }

    // 其他情况拒绝
    callback(new Error('不允许的跨域请求'));
  },
  credentials: true, // 允许携带 cookie 和认证信息
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // 允许的 HTTP 方法
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // 允许的请求头
  exposedHeaders: ['Content-Range', 'X-Content-Range'], // 暴露给前端的响应头
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Mini Mall Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/express', expressRoutes);
app.use('/api/contact', contactRoutes);

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '路由不存在'
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
// 绑定到 0.0.0.0 以允许外部访问（默认只绑定到 localhost）
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 前端地址: ${FRONTEND_URL}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM 信号 received: 关闭服务器');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 信号 received: 关闭服务器');
  process.exit(0);
});

export default app;
