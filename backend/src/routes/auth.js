/**
 * 认证路由
 * 处理用户注册、登录、Google OAuth 等
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { jwtConfig, googleOAuthConfig } from '../config/auth.js';
import User from '../models/User.js';
import { authenticate, asyncHandler } from '../middleware/auth.js';
import { errorHandler } from '../middleware/error.js';

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
 * 用户注册
 * POST /api/auth/register
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
 * 用户登录
 * POST /api/auth/login
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
 * GET /api/auth/google
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
 * Google OAuth 回调
 * GET /api/auth/google/callback
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
 * GET /api/auth/me
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
 * 退出登录（客户端删除 token 即可，这里提供接口用于记录日志等）
 * POST /api/auth/logout
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
