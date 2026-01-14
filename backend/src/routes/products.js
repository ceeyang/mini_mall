/**
 * 商品路由
 * 处理商品相关的 API 请求
 */

import express from 'express';
import { query } from 'express-validator';
import Product from '../models/Product.js';
import { optionalAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = express.Router();

/**
 * 获取商品列表
 * GET /api/products
 * 支持分类筛选、排序、分页
 */
router.get('/', [
  query('category').optional().trim(),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'date_desc', 'date_asc']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], asyncHandler(async (req, res) => {
  const { category, sort = 'date_desc', page = 1, limit = 20 } = req.query;

  // 构建查询条件
  const query = { isActive: true };
  // 过滤掉无效的分类值：undefined、null、空字符串、"全部"、"undefined"、"null"
  if (category && 
      category !== '全部' && 
      category !== 'undefined' && 
      category !== 'null' && 
      category.trim() !== '') {
    query.category = category.trim();
  }

  // 调试日志：记录查询条件
  console.log('🔍 商品查询条件:', JSON.stringify(query));

  // 构建排序
  let sortOption = {};
  switch (sort) {
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'date_asc':
      sortOption = { dateAdded: 1 };
      break;
    case 'date_desc':
    default:
      sortOption = { dateAdded: -1 };
      break;
  }

  // 分页
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 查询商品
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  // 获取总数
  const total = await Product.countDocuments(query);

  // 调试日志：记录查询结果
  console.log(`📦 查询结果: 找到 ${products.length} 个商品（共 ${total} 个）`);

  // 获取所有分类
  const categories = await Product.distinct('category', { isActive: true });

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      categories: ['全部', ...categories]
    }
  });
}));

/**
 * 获取商品详情
 * GET /api/products/:id
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: '商品不存在'
    });
  }

  res.json({
    success: true,
    data: { product }
  });
}));

export default router;
