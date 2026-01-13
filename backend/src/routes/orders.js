/**
 * 订单路由
 * 处理订单相关的 API 请求
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticate, asyncHandler } from '../middleware/auth.js';

const router = express.Router();

// 所有订单路由都需要认证
router.use(authenticate);

/**
 * 创建订单
 * POST /api/orders
 */
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('订单商品不能为空'),
  body('items.*.productId').notEmpty().withMessage('商品ID不能为空'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('商品数量必须大于0'),
  body('shipping.name').notEmpty().withMessage('收货人姓名不能为空'),
  body('shipping.phone').notEmpty().withMessage('收货人电话不能为空'),
  body('shipping.address').notEmpty().withMessage('收货地址不能为空'),
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

  const { items, shipping, paymentMethod } = req.body;

  // 验证商品并计算总价
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        message: `商品 ${item.name || item.productId} 不存在或已下架`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `商品 ${product.name} 库存不足`
      });
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity
    });

    subtotal += product.price * item.quantity;
  }

  const shippingFee = 10; // 固定运费
  const total = subtotal + shippingFee;

  // 创建订单
  const order = new Order({
    userId: req.userId,
    items: orderItems,
    shipping,
    paymentMethod,
    subtotal,
    shippingFee,
    total,
    status: 'pending'
  });

  await order.save();

  // 减少商品库存
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }

  res.status(201).json({
    success: true,
    message: '订单创建成功',
    data: { order }
  });
}));

/**
 * 获取用户订单列表
 * GET /api/orders
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { userId: req.userId };
  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('items.productId', 'name image')
    .select('-__v');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
}));

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.userId
  }).populate('items.productId', 'name image description');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: '订单不存在'
    });
  }

  res.json({
    success: true,
    data: { order }
  });
}));

/**
 * 更新订单状态（仅管理员）
 * PATCH /api/orders/:id/status
 */
router.patch('/:id/status', asyncHandler(async (req, res) => {
  // 检查用户是否为管理员
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: '无权限执行此操作'
    });
  }

  const { status, trackingNumber, expressCompany } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: '订单不存在'
    });
  }

  order.status = status;
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }
  if (expressCompany) {
    order.expressCompany = expressCompany;
  }

  await order.save();

  res.json({
    success: true,
    message: '订单状态更新成功',
    data: { order }
  });
}));

export default router;
