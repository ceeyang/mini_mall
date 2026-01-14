/**
 * 留言/联系模型
 * 定义留言数据结构和验证规则
 */

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  // 姓名
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // 邮箱
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  
  // 电话（可选）
  phone: {
    type: String,
    trim: true
  },
  
  // 留言内容
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // 状态：pending（待处理）、read（已读）、replied（已回复）
  status: {
    type: String,
    enum: ['pending', 'read', 'replied'],
    default: 'pending'
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
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
