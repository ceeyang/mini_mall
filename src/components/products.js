/**
 * 商品展示组件
 * 生成商品列表和商品卡片
 */

import { products } from '../data/products.js';
import { cartManager } from '../scripts/cart.js';
import { showNotification } from '../scripts/ui.js';

/**
 * 生成商品卡片 HTML
 * @param {Object} product - 商品对象
 * @returns {string} 商品卡片 HTML 字符串
 */
function renderProductCard(product) {
  return `
    <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden cursor-pointer border border-gray-200">
      <div class="h-64 bg-gradient-to-br ${product.image.gradient} flex items-center justify-center">
        <svg class="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-4">${product.description}</p>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-indigo-600">¥${product.price}</span>
          <button 
            class="add-to-cart-btn bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
            data-product-id="${product.id}">
            加入购物车
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成商品展示区域 HTML（首页用，只显示前3个）
 * @param {number} limit - 显示商品数量限制，默认3
 * @returns {string} 商品展示区域 HTML 字符串
 */
export function renderProducts(limit = null) {
  const displayProducts = limit ? products.slice(0, limit) : products;
  const productsHTML = displayProducts.map(product => renderProductCard(product)).join('');
  const showMoreButton = limit && products.length > limit;
  
  return `
    <section id="products" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">精选商品</h2>
        <p class="text-lg text-gray-600">发现更多优质商品，享受购物乐趣</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${productsHTML}
      </div>
      ${showMoreButton ? `
        <div class="text-center mt-12">
          <a href="products.html" class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium shadow-lg">
            查看更多商品 →
          </a>
        </div>
      ` : ''}
    </section>
  `;
}

/**
 * 初始化商品组件交互
 */
export function initProducts() {
  // 为所有"加入购物车"按钮添加事件监听
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      const product = products.find(p => p.id === productId);
      
      if (product) {
        cartManager.addItem(product, 1);
        showNotification(`${product.name} 已添加到购物车！`, 'success');
      }
    });
  });
}
