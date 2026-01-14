/**
 * 支付路由
 * 处理支付相关的 API 请求
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

// 所有支付路由都需要认证
router.use(authenticate);

/**
 * 处理支付
 * POST /api/payment/process
 */
router.post('/process', [
  body('orderId').notEmpty().withMessage('订单ID不能为空'),
  body('paymentMethod').isIn(['alipay', 'wechat', 'stripe']).withMessage('支付方式不正确')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { orderId, paymentMethod } = req.body;

  // 查找订单
  const order = await Order.findOne({
    _id: orderId,
    userId: req.userId
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: '订单不存在'
    });
  }

  if (order.paymentStatus === 'paid') {
    return res.status(400).json({
      success: false,
      message: '订单已支付'
    });
  }

  // 根据支付方式处理支付
  // 这里是模拟支付，实际应用中需要调用相应的支付 API
  let paymentResult;
  
  switch (paymentMethod) {
    case 'alipay':
      paymentResult = await processAlipayPayment(order);
      break;
    case 'wechat':
      paymentResult = await processWechatPayment(order);
      break;
    case 'stripe':
      paymentResult = await processStripePayment(order);
      break;
    default:
      return res.status(400).json({
        success: false,
        message: '不支持的支付方式'
      });
  }

  if (paymentResult.success) {
    // 更新订单支付状态
    order.paymentStatus = 'paid';
    order.paymentId = paymentResult.paymentId;
    order.status = 'processing';
    await order.save();

    res.json({
      success: true,
      message: '支付成功',
      data: {
        paymentId: paymentResult.paymentId,
        order: order
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: paymentResult.message || '支付失败'
    });
  }
}));

/**
 * 处理支付宝支付（模拟）
 */
async function processAlipayPayment(order) {
  // TODO: 集成支付宝 SDK
  // 这里返回模拟结果
  return {
    success: true,
    paymentId: `ALIPAY_${Date.now()}_${order._id}`,
    message: '支付成功'
  };
}

/**
 * 处理微信支付（模拟）
 */
async function processWechatPayment(order) {
  // TODO: 集成微信支付 SDK
  // 这里返回模拟结果
  return {
    success: true,
    paymentId: `WECHAT_${Date.now()}_${order._id}`,
    message: '支付成功'
  };
}

/**
 * 处理 Stripe 支付（模拟）
 */
async function processStripePayment(order) {
  // TODO: 集成 Stripe SDK
  // 这里返回模拟结果
  return {
    success: true,
    paymentId: `STRIPE_${Date.now()}_${order._id}`,
    message: '支付成功'
  };
}

export default router;
