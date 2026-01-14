/**
 * 留言/联系路由
 * 处理留言相关的 API 请求
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

/**
 * 提交留言
 * POST /api/contact
 */
router.post('/', [
  body('name').trim().notEmpty().withMessage('姓名不能为空'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('phone').optional().trim(),
  body('message').trim().notEmpty().withMessage('留言内容不能为空')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { name, email, phone, message } = req.body;

  // 创建留言记录
  const contact = new Contact({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : undefined,
    message: message.trim(),
    status: 'pending'
  });

  await contact.save();

  res.status(201).json({
    success: true,
    message: '留言提交成功，我们会尽快与您联系',
    data: {
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    }
  });
}));

/**
 * 获取留言列表（需要认证，仅管理员）
 * GET /api/contact
 */
router.get('/', asyncHandler(async (req, res) => {
  // TODO: 添加管理员权限验证
  const { page = 1, limit = 10, status } = req.query;

  const query = {};
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Contact.countDocuments(query);

  res.json({
    success: true,
    data: {
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

export default router;
