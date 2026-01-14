/**
 * 快递查询路由
 * 处理快递查询相关的 API 请求
 */

import express from 'express';
import { query, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

// 所有快递查询路由都需要认证
router.use(authenticate);

/**
 * 查询快递信息
 * GET /api/express/track
 */
router.get('/track', [
  query('trackingNumber').notEmpty().withMessage('快递单号不能为空'),
  query('expressCompany').optional().trim()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '验证失败',
      errors: errors.array()
    });
  }

  const { trackingNumber, expressCompany } = req.query;

  // 查找订单（验证用户是否有权限查询）
  const order = await Order.findOne({
    trackingNumber,
    userId: req.userId
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: '未找到对应的订单或无权查看'
    });
  }

  // 查询快递信息（模拟）
  // TODO: 集成快递查询 API（如快递100、菜鸟等）
  const trackingInfo = await queryExpressInfo(trackingNumber, expressCompany || order.expressCompany);

  res.json({
    success: true,
    data: {
      order: {
        orderNumber: order.orderNumber,
        status: order.status
      },
      tracking: trackingInfo
    }
  });
}));

/**
 * 查询订单的快递信息
 * GET /api/express/order/:orderId
 */
router.get('/order/:orderId', asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    userId: req.userId
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: '订单不存在或无权查看'
    });
  }

  if (!order.trackingNumber) {
    return res.json({
      success: true,
      data: {
        order: {
          orderNumber: order.orderNumber,
          status: order.status
        },
        tracking: {
          status: 'pending',
          message: '订单尚未发货'
        }
      }
    });
  }

  // 查询快递信息
  const trackingInfo = await queryExpressInfo(order.trackingNumber, order.expressCompany);

  res.json({
    success: true,
    data: {
      order: {
        orderNumber: order.orderNumber,
        status: order.status
      },
      tracking: trackingInfo
    }
  });
}));

/**
 * 查询快递信息（模拟）
 * TODO: 集成真实的快递查询 API
 */
async function queryExpressInfo(trackingNumber, expressCompany) {
  // 模拟快递查询结果
  // 实际应用中需要调用快递查询 API
  return {
    trackingNumber,
    expressCompany: expressCompany || '顺丰速运',
    status: 'in_transit',
    statusText: '运输中',
    currentLocation: '北京分拨中心',
    timeline: [
      {
        time: new Date().toISOString(),
        location: '北京分拨中心',
        description: '快件已到达北京分拨中心'
      },
      {
        time: new Date(Date.now() - 3600000).toISOString(),
        location: '上海分拨中心',
        description: '快件已离开上海分拨中心'
      },
      {
        time: new Date(Date.now() - 7200000).toISOString(),
        location: '上海分拨中心',
        description: '快件已到达上海分拨中心'
      }
    ]
  };
}

export default router;
