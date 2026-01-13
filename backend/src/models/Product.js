/**
 * 商品模型
 * 定义商品数据结构和验证规则
 */

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // 基本信息
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  // 分类
  category: {
    type: String,
    required: true,
    trim: true
  },
  
  // 图片
  image: {
    gradient: {
      type: String,
      default: 'from-indigo-400 to-purple-500'
    },
    url: {
      type: String
    }
  },
  
  // 库存
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // 上架日期
  dateAdded: {
    type: Date,
    default: Date.now
  },
  
  // 商品状态
  isActive: {
    type: Boolean,
    default: true
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

// 索引
productSchema.index({ category: 1 });
productSchema.index({ dateAdded: -1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
