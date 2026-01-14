/**
 * 数据库初始化脚本
 * 用于初始化 MongoDB 数据库，创建集合并导入初始数据
 * 
 * 使用方法：
 * node database/init-db.js
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../src/config/database.js';
import Product from '../src/models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 验证和规范化商品数据，确保符合模型定义
 * @param {Object} product - 原始商品数据
 * @returns {Object} 规范化后的商品数据
 */
function normalizeProduct(product) {
  const normalized = {
    // 必需字段
    name: String(product.name || '').trim(),
    description: String(product.description || '').trim(),
    price: Number(product.price) || 0,
    category: String(product.category || '').trim(),
    
    // 库存（默认 0）
    stock: Number(product.stock) || 0,
    
    // 商品状态（默认 true）
    isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
    
    // 图片信息
    image: {
      gradient: product.image?.gradient || 'from-indigo-400 to-purple-500',
      url: product.image?.url || undefined
    },
    
    // 日期字段处理
    dateAdded: product.dateAdded ? new Date(product.dateAdded) : new Date(),
  };
  
  // 验证必需字段
  if (!normalized.name) {
    throw new Error(`商品缺少必需字段: name`);
  }
  if (!normalized.description) {
    throw new Error(`商品 "${normalized.name}" 缺少必需字段: description`);
  }
  if (normalized.price <= 0) {
    throw new Error(`商品 "${normalized.name}" 的价格无效: ${product.price}`);
  }
  if (!normalized.category) {
    throw new Error(`商品 "${normalized.name}" 缺少必需字段: category`);
  }
  
  return normalized;
}

/**
 * 从 JSON 文件导入商品数据
 * @param {boolean} force - 是否强制导入（清空现有数据）
 */
async function importProductsFromJSON(force = false) {
  try {
    const jsonPath = join(__dirname, 'products-import.json');
    const jsonData = readFileSync(jsonPath, 'utf-8');
    const rawProducts = JSON.parse(jsonData);
    
    if (!Array.isArray(rawProducts)) {
      throw new Error('products-import.json 必须是一个数组');
    }
    
    console.log(`📦 准备导入 ${rawProducts.length} 个商品...`);
    
    // 检查是否已有商品
    const existingCount = await Product.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`⚠️  数据库中已有 ${existingCount} 个商品`);
      console.log('   如需重新导入，请使用 --force 参数或先清空数据库');
      return null;
    }
    
    // 如果需要强制导入，先清空现有数据
    if (force && existingCount > 0) {
      console.log(`🗑️  清空现有 ${existingCount} 个商品...`);
      await Product.deleteMany({});
      console.log('✅ 已清空现有商品');
    }
    
    // 验证和规范化所有商品数据
    console.log('🔍 验证和规范化商品数据...');
    const normalizedProducts = [];
    const errors = [];
    
    for (let i = 0; i < rawProducts.length; i++) {
      try {
        const normalized = normalizeProduct(rawProducts[i]);
        normalizedProducts.push(normalized);
      } catch (error) {
        errors.push(`第 ${i + 1} 个商品: ${error.message}`);
      }
    }
    
    if (errors.length > 0) {
      console.error('❌ 数据验证失败:');
      errors.forEach(err => console.error(`   - ${err}`));
      throw new Error(`有 ${errors.length} 个商品数据验证失败`);
    }
    
    console.log(`✅ 所有 ${normalizedProducts.length} 个商品数据验证通过`);
    
    // 插入商品数据
    const insertedProducts = await Product.insertMany(normalizedProducts, {
      ordered: false // 即使部分失败也继续插入
    });
    console.log(`✅ 成功导入 ${insertedProducts.length} 个商品`);
    
    return insertedProducts;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⚠️  products-import.json 文件不存在，使用默认种子数据');
      return null;
    }
    throw error;
  }
}

/**
 * 使用种子数据导入商品
 * @param {boolean} force - 是否强制导入（清空现有数据）
 */
async function importProductsFromSeed(force = false) {
  try {
    const { default: products } = await import('./seeds/products.js');
    
    console.log(`📦 准备导入 ${products.length} 个商品（种子数据）...`);
    
    // 检查是否已有商品
    const existingCount = await Product.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`⚠️  数据库中已有 ${existingCount} 个商品`);
      console.log('   如需重新导入，请使用 --force 参数或先清空数据库');
      return null;
    }
    
    // 如果需要强制导入，先清空现有数据
    if (force && existingCount > 0) {
      console.log(`🗑️  清空现有 ${existingCount} 个商品...`);
      await Product.deleteMany({});
      console.log('✅ 已清空现有商品');
    }
    
    // 验证和规范化所有商品数据
    console.log('🔍 验证和规范化商品数据...');
    const normalizedProducts = [];
    const errors = [];
    
    for (let i = 0; i < products.length; i++) {
      try {
        const normalized = normalizeProduct(products[i]);
        normalizedProducts.push(normalized);
      } catch (error) {
        errors.push(`第 ${i + 1} 个商品: ${error.message}`);
      }
    }
    
    if (errors.length > 0) {
      console.error('❌ 数据验证失败:');
      errors.forEach(err => console.error(`   - ${err}`));
      throw new Error(`有 ${errors.length} 个商品数据验证失败`);
    }
    
    console.log(`✅ 所有 ${normalizedProducts.length} 个商品数据验证通过`);
    
    // 插入商品数据
    const insertedProducts = await Product.insertMany(normalizedProducts, {
      ordered: false // 即使部分失败也继续插入
    });
    console.log(`✅ 成功导入 ${insertedProducts.length} 个商品`);
    
    return insertedProducts;
  } catch (error) {
    console.error('❌ 导入种子数据失败:', error);
    throw error;
  }
}

/**
 * 初始化数据库
 * @param {boolean} force - 是否强制导入（清空现有数据）
 */
async function initDatabase(force = false) {
  try {
    console.log('🚀 开始初始化数据库...\n');
    
    if (force) {
      console.log('⚠️  强制模式：将清空现有商品数据\n');
    }
    
    // 连接数据库
    console.log('📡 正在连接数据库...');
    await connectDB();
    console.log('✅ 数据库连接成功\n');
    
    // 尝试从 JSON 文件导入（优先）
    let imported = await importProductsFromJSON(force);
    
    // 如果 JSON 导入失败，使用种子数据
    if (!imported) {
      console.log('\n📦 使用种子数据导入...');
      imported = await importProductsFromSeed(force);
    }
    
    // 显示统计信息
    console.log('\n📊 数据库统计信息：');
    const productCount = await Product.countDocuments();
    const categories = await Product.distinct('category');
    
    console.log(`   - 商品总数: ${productCount}`);
    console.log(`   - 分类数量: ${categories.length}`);
    console.log(`   - 分类列表: ${categories.join(', ')}`);
    
    console.log('\n✅ 数据库初始化完成！');
    console.log('\n💡 提示：');
    console.log('   - 集合会在首次插入数据时自动创建');
    console.log('   - 可以使用 MongoDB Compass 查看数据');
    console.log('   - 可以使用以下命令查看商品：');
    console.log('     node -e "import(\'./src/models/Product.js\').then(m => m.default.find().then(ps => console.log(ps)))"');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 数据库初始化失败:', error);
    console.error('\n错误详情:', error.message);
    if (error.stack) {
      console.error('\n堆栈信息:', error.stack);
    }
    process.exit(1);
  }
}

// 检查命令行参数
const force = process.argv.includes('--force') || process.argv.includes('-f');

// 运行初始化
initDatabase(force);
