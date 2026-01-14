/**
 * 服务器入口文件
 * 启动 Express 服务器并配置中间件
 */

import express from 'express';
import cors from 'cors';
// 导入环境变量加载器（会自动加载）
import './config/env-loader.js';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import expressRoutes from './routes/express.js';
import { errorHandler } from './middleware/error.js';

// 环境变量已在 env-loader.js 中加载

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// 连接数据库
connectDB();

// 中间件配置
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
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
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
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
