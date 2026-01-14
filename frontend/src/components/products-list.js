/**
 * 商品列表组件（商品列表页面专用）
 * 包含分类筛选、排序功能
 */

import { productsAPI } from '../scripts/products-api.js';
import { cartManager } from '../scripts/cart.js';
import { showNotification } from '../scripts/ui.js';

// 当前筛选和排序状态
let currentFilter = {
  category: 'all',
  sortBy: 'date', // 'date', 'price-asc', 'price-desc'
  sortOrder: 'desc' // 'asc', 'desc'
};

// 缓存的商品数据
let cachedProducts = [];
let cachedCategories = [];

/**
 * 生成商品卡片 HTML
 * @param {Object} product - 商品对象
 * @returns {string} 商品卡片 HTML 字符串
 */
function renderProductCard(product) {
  const dateAdded = new Date(product.dateAdded).toLocaleDateString('zh-CN');
  
  return `
    <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200">
      <div class="h-64 bg-gradient-to-br ${product.image.gradient} flex items-center justify-center">
        <svg class="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      </div>
      <div class="p-6">
        <div class="flex items-center justify-between mb-2">
          <span class="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-full">${product.category}</span>
          <span class="text-xs text-gray-500">${dateAdded}</span>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-4">${product.description}</p>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-indigo-600">¥${product.price}</span>
          <button 
            class="add-to-cart-btn bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
            data-product-id="${product.id || product._id}">
            加入购物车
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * 筛选和排序商品
 * @param {Array} productsList - 商品列表
 * @returns {Array} 筛选和排序后的商品列表
 */
function filterAndSortProducts(productsList) {
  let filtered = productsList;

  // 按分类筛选
  if (currentFilter.category !== 'all') {
    filtered = filtered.filter(p => p.category === currentFilter.category);
  }

  // 排序
  filtered = [...filtered].sort((a, b) => {
    switch (currentFilter.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'date':
      default:
        const dateA = new Date(a.dateAdded);
        const dateB = new Date(b.dateAdded);
        return currentFilter.sortOrder === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
    }
  });

  return filtered;
}

/**
 * 生成商品列表区域 HTML
 * @returns {Promise<string>} 商品列表区域 HTML 字符串
 */
export async function renderProductsList() {
  // 从 API 获取商品数据
  if (cachedProducts.length === 0) {
    const sortParam = currentFilter.sortBy === 'price-asc' ? 'price_asc' : 
                     currentFilter.sortBy === 'price-desc' ? 'price_desc' : 'date_desc';
    const params = {
      category: currentFilter.category !== 'all' ? currentFilter.category : undefined,
      sort: sortParam,
    };
    cachedProducts = await productsAPI.getProducts(params);
    cachedCategories = await productsAPI.getCategories();
  }
  
  const filteredProducts = filterAndSortProducts(cachedProducts);
  const productsHTML = filteredProducts.map(product => renderProductCard(product)).join('');

  return `
    <section id="products" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">商品列表</h1>
        <p class="text-lg text-gray-600">发现更多优质商品，享受购物乐趣</p>
      </div>

      <!-- 筛选和排序工具栏 -->
      <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- 分类筛选 -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">分类：</label>
            <select 
              id="category-filter" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer">
              <option value="all">全部</option>
              ${cachedCategories.map(cat => `
                <option value="${cat}" ${currentFilter.category === cat ? 'selected' : ''}>${cat}</option>
              `).join('')}
            </select>
          </div>

          <!-- 排序选项 -->
          <div class="flex items-center gap-4">
            <label class="text-sm font-medium text-gray-700 whitespace-nowrap">排序：</label>
            <select 
              id="sort-filter" 
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer">
              <option value="date-desc" ${currentFilter.sortBy === 'date' && currentFilter.sortOrder === 'desc' ? 'selected' : ''}>上架日期：最新</option>
              <option value="date-asc" ${currentFilter.sortBy === 'date' && currentFilter.sortOrder === 'asc' ? 'selected' : ''}>上架日期：最早</option>
              <option value="price-asc" ${currentFilter.sortBy === 'price-asc' ? 'selected' : ''}>价格：从低到高</option>
              <option value="price-desc" ${currentFilter.sortBy === 'price-desc' ? 'selected' : ''}>价格：从高到低</option>
            </select>
          </div>

          <!-- 商品数量显示 -->
          <div class="text-sm text-gray-600">
            共找到 <span class="font-semibold text-indigo-600">${filteredProducts.length}</span> 件商品
          </div>
        </div>
      </div>

      <!-- 商品网格 -->
      ${filteredProducts.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${productsHTML}
        </div>
      ` : `
        <div class="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <h3 class="text-xl font-bold text-gray-900 mb-2">暂无商品</h3>
          <p class="text-gray-600 mb-6">请尝试调整筛选条件</p>
          <button 
            id="reset-filter-btn"
            class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
            重置筛选
          </button>
        </div>
      `}
    </section>
  `;
}

/**
 * 更新商品列表显示
 */
export async function updateProductsList() {
  // 清除缓存，重新获取数据
  cachedProducts = [];
  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    productsContainer.innerHTML = await renderProductsList();
    initProductsList();
  }
}

/**
 * 初始化商品列表组件交互
 */
export function initProductsList() {
  // 分类筛选
  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      currentFilter.category = this.value;
      updateProductsList();
    });
  }

  // 排序筛选
  const sortFilter = document.getElementById('sort-filter');
  if (sortFilter) {
    sortFilter.addEventListener('change', function() {
      const [sortBy, order] = this.value.split('-');
      currentFilter.sortBy = sortBy;
      currentFilter.sortOrder = order || 'desc';
      updateProductsList();
    });
  }

  // 重置筛选
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      currentFilter = {
        category: 'all',
        sortBy: 'date',
        sortOrder: 'desc'
      };
      updateProductsList();
    });
  }

  // 为所有"加入购物车"按钮添加事件监听
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', async function() {
      const productId = this.getAttribute('data-product-id');
      
      // 从缓存或 API 获取商品详情
      let product = cachedProducts.find(p => p.id === productId || p._id === productId);
      
      if (!product) {
        product = await productsAPI.getProductById(productId);
      }
      
      if (product) {
        cartManager.addItem(product, 1);
        showNotification(`${product.name} 已添加到购物车！`, 'success');
      } else {
        showNotification('商品信息获取失败', 'error');
      }
    });
  });
}
