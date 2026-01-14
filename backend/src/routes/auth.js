/**
 * @fileoverview 认证路由模块
 * 处理用户注册、登录、Google OAuth 等认证相关功能
 * @module routes/auth
 * @author Mini Mall Team
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { jwtConfig, googleOAuthConfig } from '../config/auth.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { errorHandler, asyncHandler } from '../middleware/error.js';

const router = express.Router();

// 动态导入 passport（仅在需要 Google OAuth 时）
let passport = null;
if (googleOAuthConfig.clientID && googleOAuthConfig.clientSecret) {
  try {
    const passportModule = await import('passport');
    passport = passportModule.default;
    await import('../config/passport.js');
  } catch (error) {
    console.warn('Google OAuth 配置加载失败:', error.message);
  }
}

/**
 * 用户注册接口
 * @route POST /api/auth/register
 * @group Authentication - 认证相关接口
 * @param {string} name.body.required - 用户姓名
 * @param {string} email.body.required - 用户邮箱（必须是有效的邮箱格式）
 * @param {string} password.body.required - 用户密码（至少6位）
 * @returns {Object} 200 - 注册成功
 * @returns {Object} 400 - 验证失败或邮箱已被注册
 * @returns {Object} 500 - 服务器错误
 * @example
 * // 请求示例
 * POST /api/auth/register
 * {
 *   "name": "张三",
 *   "email": "zhangsan@example.com",
 *   "password": "123456"
 * }
 * 
 * // 成功响应示例
 * {
 *   "success": true,
 *   "message": "注册成功",
 *   "data": {
 *     "user": {
 *       "id": "507f1f77bcf86cd799439011",
 *       "name": "张三",
 *       "email": "zhangsan@example.com",
 *       "avatar": null
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
router.post('/register', [
  body('name').trim().notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { name, email, password } = req.body;

  // 检查用户是否已存在
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: '该邮箱已被注册'
    });
  }

  // 创建新用户
  const user = new User({
    name,
    email,
    password
  });

  await user.save();

  // 生成 JWT token
  const token = jwt.sign(
    { userId: user._id },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    }
  });
}));

/**
 * 用户登录接口
 * @route POST /api/auth/login
 * @group Authentication - 认证相关接口
 * @param {string} email.body.required - 用户邮箱
 * @param {string} password.body.required - 用户密码
 * @returns {Object} 200 - 登录成功
 * @returns {Object} 401 - 邮箱或密码错误
 * @returns {Object} 403 - 账户已被禁用
 * @returns {Object} 400 - 验证失败
 * @example
 * // 请求示例
 * POST /api/auth/login
 * {
 *   "email": "zhangsan@example.com",
 *   "password": "123456"
 * }
 * 
 * // 成功响应示例
 * {
 *   "success": true,
 *   "message": "登录成功",
 *   "data": {
 *     "user": {
 *       "id": "507f1f77bcf86cd799439011",
 *       "name": "张三",
 *       "email": "zhangsan@example.com",
 *       "avatar": null
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
router.post('/login', [
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('password').notEmpty().withMessage('密码不能为空')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // 查找用户
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: '邮箱或密码错误'
    });
  }

  // 检查账户状态
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: '账户已被禁用'
    });
  }

  // 验证密码
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: '邮箱或密码错误'
    });
  }

  // 生成 JWT token
  const token = jwt.sign(
    { userId: user._id },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.json({
    success: true,
    message: '登录成功',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      token
    }
  });
}));

/**
 * Google OAuth 登录入口
 * @route GET /api/auth/google
 * @group Authentication - 认证相关接口
 * @returns {Object} 302 - 重定向到 Google 登录页面
 * @returns {Object} 501 - Google OAuth 未配置
 * @description 重定向用户到 Google OAuth 授权页面
 */
router.get('/google', (req, res, next) => {
  if (!passport || !googleOAuthConfig.clientID || !googleOAuthConfig.clientSecret) {
    return res.status(501).json({
      success: false,
      message: 'Google OAuth 未配置'
    });
  }
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

/**
 * Google OAuth 回调接口
 * @route GET /api/auth/google/callback
 * @group Authentication - 认证相关接口
 * @param {string} code.query - Google 返回的授权码
 * @returns {Object} 302 - 重定向到前端页面（携带 token）
 * @returns {Object} 501 - Google OAuth 未配置
 * @description Google OAuth 授权后的回调处理，生成 JWT token 并重定向
 */
router.get('/google/callback',
  (req, res, next) => {
    if (!passport || !googleOAuthConfig.clientID || !googleOAuthConfig.clientSecret) {
      return res.status(501).json({
        success: false,
        message: 'Google OAuth 未配置'
      });
    }
    passport.authenticate('google', { session: false })(req, res, next);
  },
  asyncHandler(async (req, res) => {
    // Passport 会将用户信息放在 req.user
    const user = req.user;

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // 重定向到前端，携带 token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/src/pages/login.html?token=${token}&success=true`);
  })
);

/**
 * 获取当前用户信息
 * @route GET /api/auth/me
 * @group Authentication - 认证相关接口
 * @param {string} Authorization.header.required - Bearer token
 * @returns {Object} 200 - 用户信息
 * @returns {Object} 401 - 未授权或 token 无效
 * @example
 * // 请求示例
 * GET /api/auth/me
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // 成功响应示例
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "507f1f77bcf86cd799439011",
 *       "name": "张三",
 *       "email": "zhangsan@example.com",
 *       "avatar": null,
 *       "role": "user"
 *     }
 *   }
 * }
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  
  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    }
  });
}));

/**
 * 用户退出登录
 * @route POST /api/auth/logout
 * @group Authentication - 认证相关接口
 * @param {string} Authorization.header.required - Bearer token
 * @returns {Object} 200 - 退出成功
 * @returns {Object} 401 - 未授权
 * @description 客户端删除 token 即可，此接口主要用于记录日志等
 * @example
 * // 请求示例
 * POST /api/auth/logout
 * Headers: {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // 成功响应示例
 * {
 *   "success": true,
 *   "message": "退出登录成功"
 * }
 */
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  // 在实际应用中，可以将 token 加入黑名单
  // 这里简单返回成功
  res.json({
    success: true,
    message: '退出登录成功'
  });
}));

export default router;
