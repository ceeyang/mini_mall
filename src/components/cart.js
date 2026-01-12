/**
 * 购物车组件
 * 生成购物车界面并处理购物车相关交互
 */

import { cartManager } from '../scripts/cart.js';
import { showNotification } from '../scripts/ui.js';

/**
 * 生成购物车商品项 HTML
 * @param {Object} item - 购物车商品项
 * @returns {string} 商品项 HTML 字符串
 */
function renderCartItem(item) {
  const total = item.price * item.quantity;
  
  return `
    <div class="cart-item flex items-center justify-between p-4 border-b border-gray-200" data-item-id="${item.id}">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900">${item.name}</h4>
        <p class="text-sm text-gray-600">¥${item.price} × ${item.quantity}</p>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <button 
            class="decrease-quantity-btn w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            data-product-id="${item.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
            </svg>
          </button>
          <span class="quantity-display w-8 text-center font-medium">${item.quantity}</span>
          <button 
            class="increase-quantity-btn w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            data-product-id="${item.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        </div>
        <span class="item-total font-bold text-indigo-600 w-20 text-right">¥${total}</span>
        <button 
          class="remove-item-btn text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer p-2"
          data-product-id="${item.id}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * 生成购物车区域 HTML
 * @returns {string} 购物车区域 HTML 字符串
 */
export function renderCart() {
  const cartItems = cartManager.getItems();
  const isEmpty = cartManager.isEmpty();
  const totalPrice = cartManager.getTotalPrice();
  
  if (isEmpty) {
    return `
      <section id="cart" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h2>
          <p class="text-gray-600 mb-6">快去添加一些商品吧！</p>
          <a href="#products" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
            浏览商品
          </a>
        </div>
      </section>
    `;
  }
  
  const itemsHTML = cartItems.map(item => renderCartItem(item)).join('');
  
  return `
    <section id="cart" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-3xl font-bold text-gray-900">购物车</h2>
          <p class="text-gray-600 mt-1">共 ${cartManager.getTotalItems()} 件商品</p>
        </div>
        <div class="cart-items">
          ${itemsHTML}
        </div>
        <div class="p-6 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xl font-semibold text-gray-900">总计：</span>
            <span class="text-3xl font-bold text-indigo-600">¥${totalPrice}</span>
          </div>
          <div class="flex space-x-4">
            <button 
              id="clear-cart-btn"
              class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer font-medium">
              清空购物车
            </button>
            <a 
              href="checkout.html"
              class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium text-center">
              去结算
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * 更新购物车显示
 */
export function updateCart() {
  const cartSection = document.getElementById('cart');
  if (cartSection) {
    cartSection.outerHTML = renderCart();
    initCart();
  }
}

/**
 * 初始化购物车交互
 */
export function initCart() {
  // 增加数量
  document.querySelectorAll('.increase-quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      const item = cartManager.getItems().find(i => i.id === productId);
      if (item) {
        cartManager.updateQuantity(productId, item.quantity + 1);
        updateCart();
      }
    });
  });

  // 减少数量
  document.querySelectorAll('.decrease-quantity-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      const item = cartManager.getItems().find(i => i.id === productId);
      if (item && item.quantity > 1) {
        cartManager.updateQuantity(productId, item.quantity - 1);
        updateCart();
      }
    });
  });

  // 删除商品
  document.querySelectorAll('.remove-item-btn').forEach(button => {
    button.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      const item = cartManager.getItems().find(i => i.id === productId);
      if (item) {
        cartManager.removeItem(productId);
        showNotification(`${item.name} 已从购物车移除`, 'info');
        updateCart();
      }
    });
  });

  // 清空购物车
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function() {
      if (confirm('确定要清空购物车吗？')) {
        cartManager.clearCart();
        showNotification('购物车已清空', 'info');
        updateCart();
      }
    });
  }

  // 去结算按钮已经是链接，无需额外处理
}
