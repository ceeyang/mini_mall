/**
 * 订单模型
 * 定义订单数据结构和验证规则
 */

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // 订单号（自动生成）
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // 用户信息
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 商品列表
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  
  // 配送信息
  shipping: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String
    }
  },
  
  // 价格信息
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    default: 10,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // 支付信息
  paymentMethod: {
    type: String,
    enum: ['alipay', 'wechat', 'stripe'],
    required: true
  },
  paymentId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // 订单状态
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // 快递信息
  trackingNumber: {
    type: String
  },
  expressCompany: {
    type: String
  },
  
  // 时间戳
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 生成订单号（保存前）
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // 生成订单号：日期 + 随机数
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `MM${dateStr}${random}`;
  }
  next();
});

// 索引
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
