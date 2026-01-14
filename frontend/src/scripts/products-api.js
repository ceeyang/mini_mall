/**
 * 商品 API 服务模块
 * 处理商品相关的 API 调用
 */

import { apiGet } from './api.js';

/**
 * 商品 API 服务类
 */
class ProductsAPI {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {string} params.category - 商品分类
   * @param {string} params.sort - 排序方式 (price_asc, price_desc, date_desc)
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @returns {Promise<Array>} 商品列表
   */
  async getProducts(params = {}) {
    try {
      const result = await apiGet('products', params);
      
      if (result.success && result.data) {
        // 转换后端数据格式为前端需要的格式
        return this.transformProducts(result.data.products || result.data);
      }
      
      console.error('获取商品列表失败:', result.message);
      return [];
    } catch (error) {
      console.error('获取商品列表错误:', error);
      return [];
    }
  }

  /**
   * 获取商品详情
   * @param {string} productId - 商品 ID
   * @returns {Promise<Object|null>} 商品对象
   */
  async getProductById(productId) {
    try {
      const result = await apiGet(`products/${productId}`);
      
      if (result.success && result.data) {
        return this.transformProduct(result.data.product || result.data);
      }
      
      console.error('获取商品详情失败:', result.message);
      return null;
    } catch (error) {
      console.error('获取商品详情错误:', error);
      return null;
    }
  }

  /**
   * 获取商品分类列表
   * @param {Array} products - 可选的商品列表，如果提供则从中提取分类，否则从 API 获取
   * @returns {Promise<Array>} 分类列表
   */
  async getCategories(products = null) {
    try {
      // 如果提供了商品列表，直接从列表中提取分类
      if (products && Array.isArray(products) && products.length > 0) {
        const categories = [...new Set(products.map(p => p.category || p.categoryName))];
        return categories.filter(Boolean).sort();
      }
      
      // 否则从 API 获取（仅在必要时调用）
      const result = await apiGet('products');
      const productsList = result.success && result.data 
        ? (result.data.products || result.data) 
        : [];
      
      // 从商品列表中提取分类
      const categories = [...new Set(productsList.map(p => p.category || p.categoryName))];
      return categories.filter(Boolean).sort();
    } catch (error) {
      console.error('获取分类列表错误:', error);
      return [];
    }
  }

  /**
   * 转换后端商品数据格式为前端格式
   * @param {Object|Array} data - 后端返回的商品数据
   * @returns {Array} 转换后的商品数组
   */
  transformProducts(data) {
    const products = Array.isArray(data) ? data : [data];
    return products.map(product => this.transformProduct(product));
  }

  /**
   * 转换单个商品数据格式
   * @param {Object} product - 后端返回的商品对象
   * @returns {Object} 转换后的商品对象
   */
  transformProduct(product) {
    // 后端字段映射到前端字段
    return {
      id: product._id || product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || product.categoryName,
      dateAdded: product.createdAt || product.dateAdded,
      // 如果没有图片，使用默认渐变
      image: product.image || {
        gradient: this.getGradientByCategory(product.category || product.categoryName),
      },
      // 保留原始数据中的其他字段
      ...product,
    };
  }

  /**
   * 根据分类获取渐变颜色
   * @param {string} category - 商品分类
   * @returns {string} 渐变类名
   */
  getGradientByCategory(category) {
    const gradients = {
      '电子产品': 'from-indigo-400 to-purple-500',
      '家居用品': 'from-pink-400 to-red-500',
      '服装配饰': 'from-green-400 to-blue-500',
      'default': 'from-gray-400 to-gray-500',
    };
    return gradients[category] || gradients.default;
  }
}

// 导出单例实例
export const productsAPI = new ProductsAPI();
