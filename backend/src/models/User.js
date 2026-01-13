/**
 * 用户模型
 * 定义用户数据结构和验证规则
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // 基本信息
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // Google OAuth 用户可能没有密码
    required: function() {
      return !this.googleId;
    },
    minlength: 6
  },
  
  // Google OAuth
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  avatar: {
    type: String
  },
  
  // 用户角色
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // 账户状态
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

// 密码加密中间件（保存前）
userSchema.pre('save', async function(next) {
  // 如果密码未修改，跳过
  if (!this.isModified('password')) {
    return next();
  }
  
  // 加密密码
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 比较密码方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// 转换为 JSON 时移除敏感信息
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;
