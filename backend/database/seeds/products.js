/**
 * 商品种子数据
 * 用于初始化数据库中的商品数据
 */

import Product from '../../src/models/Product.js';
import { connectDB } from '../../src/config/database.js';

const products = [
  {
    name: '精品商品 1',
    description: '高品质精选商品，为您带来卓越体验',
    price: 299,
    category: '电子产品',
    stock: 100,
    dateAdded: new Date('2024-01-15')
  },
  {
    name: '精品商品 2',
    description: '时尚设计，品质保证，值得拥有',
    price: 599,
    category: '电子产品',
    stock: 50,
    dateAdded: new Date('2024-01-20')
  },
  {
    name: '精品商品 3',
    description: '经典款式，永不过时',
    price: 899,
    category: '电子产品',
    stock: 30,
    dateAdded: new Date('2024-02-01')
  },
  {
    name: '精品商品 4',
    description: '创新科技，引领未来',
    price: 1299,
    category: '家居用品',
    stock: 80,
    dateAdded: new Date('2024-02-10')
  },
  {
    name: '精品商品 5',
    description: '舒适体验，品质生活',
    price: 399,
    category: '家居用品',
    stock: 60,
    dateAdded: new Date('2024-02-15')
  },
  {
    name: '精品商品 6',
    description: '精致工艺，匠心打造',
    price: 699,
    category: '家居用品',
    stock: 40,
    dateAdded: new Date('2024-02-20')
  },
  {
    name: '精品商品 7',
    description: '时尚潮流，个性选择',
    price: 499,
    category: '服装配饰',
    stock: 90,
    dateAdded: new Date('2024-03-01')
  },
  {
    name: '精品商品 8',
    description: '优质材料，舒适体验',
    price: 799,
    category: '服装配饰',
    stock: 70,
    dateAdded: new Date('2024-03-05')
  },
  {
    name: '精品商品 9',
    description: '经典设计，永恒魅力',
    price: 999,
    category: '服装配饰',
    stock: 25,
    dateAdded: new Date('2024-03-10')
  }
];

/**
 * 初始化商品数据
 */
async function seedProducts() {
  try {
    await connectDB();

    // 清空现有商品（可选）
    // await Product.deleteMany({});

    // 插入商品数据
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ 成功插入 ${insertedProducts.length} 个商品`);

    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化商品数据失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，执行初始化
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts();
}

export default products;
