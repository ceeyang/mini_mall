/**
 * 用户中心组件
 * 生成用户中心界面，包含订单查询、快递进度等功能
 */

import { authManager } from '../scripts/auth.js';
import { orderManager } from '../scripts/orders.js';
import { showNotification } from '../scripts/ui.js';
import { showConfirm } from '../scripts/modal.js';

/**
 * 生成订单状态标签 HTML
 * @param {string} status - 订单状态
 * @returns {string} 状态标签 HTML
 */
function renderOrderStatus(status) {
  const statusMap = {
    pending: { text: '待支付', color: 'bg-yellow-100 text-yellow-800' },
    paid: { text: '已支付', color: 'bg-blue-100 text-blue-800' },
    processing: { text: '处理中', color: 'bg-indigo-100 text-indigo-800' },
    shipped: { text: '已发货', color: 'bg-purple-100 text-purple-800' },
    delivered: { text: '已送达', color: 'bg-green-100 text-green-800' },
    cancelled: { text: '已取消', color: 'bg-red-100 text-red-800' }
  };

  const statusInfo = statusMap[status] || statusMap.pending;
  return `<span class="px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}">${statusInfo.text}</span>`;
}

/**
 * 生成快递状态标签 HTML
 * @param {string} status - 快递状态
 * @returns {string} 状态标签 HTML
 */
function renderTrackingStatus(status) {
  const statusMap = {
    pending: { text: '待发货', color: 'bg-gray-100 text-gray-800' },
    in_transit: { text: '运输中', color: 'bg-blue-100 text-blue-800' },
    out_for_delivery: { text: '派送中', color: 'bg-purple-100 text-purple-800' },
    delivered: { text: '已送达', color: 'bg-green-100 text-green-800' }
  };

  const statusInfo = statusMap[status] || statusMap.pending;
  return `<span class="px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}">${statusInfo.text}</span>`;
}

/**
 * 生成订单卡片 HTML
 * @param {Object} order - 订单对象
 * @returns {string} 订单卡片 HTML
 */
function renderOrderCard(order) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsSummary = order.items.map(item => item.name).join('、');
  const hasTracking = order.tracking && order.tracking.number;

  return `
    <div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">订单号：${order.id}</h3>
            <p class="text-sm text-gray-600">${orderDate}</p>
          </div>
          ${renderOrderStatus(order.status)}
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-2">商品：${itemsSummary}</p>
          <p class="text-sm text-gray-600">共 ${order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品</p>
        </div>

        ${hasTracking ? `
          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">快递单号：</span>
              <span class="text-sm text-gray-900 font-mono">${order.tracking.number}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">快递状态：</span>
              ${renderTrackingStatus(order.tracking.status)}
            </div>
          </div>
        ` : ''}

        <div class="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <span class="text-sm text-gray-600">总计：</span>
            <span class="text-xl font-bold text-indigo-600 ml-2">¥${order.total}</span>
          </div>
          <div class="flex space-x-2">
            ${hasTracking ? `
              <button 
                class="view-tracking-btn px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer text-sm font-medium"
                data-order-id="${order.id}">
                查看物流
              </button>
            ` : ''}
            <button 
              class="view-order-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer text-sm font-medium"
              data-order-id="${order.id}">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成用户中心 HTML
 * @returns {string} 用户中心 HTML 字符串
 */
export function renderUserCenter() {
  const user = authManager.getCurrentUser();
  
  if (!user) {
    return `
      <section id="user-center" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
          <p class="text-gray-600 mb-6">登录后即可查看订单和快递进度</p>
          <a href="login.html" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
            立即登录
          </a>
        </div>
      </section>
    `;
  }

  const orders = orderManager.getUserOrders(user.id);
  const ordersHTML = orders.length > 0 
    ? orders.map(order => renderOrderCard(order)).join('')
    : `
      <div class="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-2">暂无订单</h3>
        <p class="text-gray-600 mb-6">快去选购心仪的商品吧！</p>
        <a href="products.html" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
          去购物
        </a>
      </div>
    `;

  return `
    <section id="user-center" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              ${user.avatar ? `
                <img src="${user.avatar}" alt="${user.name}" class="w-16 h-16 rounded-full object-cover">
              ` : `
                <span class="text-2xl font-bold text-indigo-600">${user.name.charAt(0).toUpperCase()}</span>
              `}
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">${user.name}</h2>
              <p class="text-gray-600">${user.email}</p>
              <p class="text-sm text-gray-500 mt-1">
                ${user.loginMethod === 'google' ? 'Google 账号登录' : '邮箱登录'}
              </p>
            </div>
          </div>
          <button 
            id="logout-btn"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer font-medium">
            退出登录
          </button>
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">我的订单</h2>
        <div class="space-y-4" id="orders-list">
          ${ordersHTML}
        </div>
      </div>
    </section>
  `;
}

/**
 * 生成订单详情模态框 HTML
 * @param {Object} order - 订单对象
 * @returns {string} 订单详情 HTML
 */
function renderOrderDetail(order) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsHTML = order.items.map(item => `
    <div class="flex items-center justify-between py-3 border-b border-gray-200">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900">${item.name}</h4>
        <p class="text-sm text-gray-600">¥${item.price} × ${item.quantity}</p>
      </div>
      <span class="font-bold text-gray-900">¥${item.price * item.quantity}</span>
    </div>
  `).join('');

  return `
    <div id="order-detail-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900">订单详情</h3>
          <button 
            id="close-modal-btn"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">订单信息</h4>
            <div class="space-y-1 text-sm text-gray-600">
              <p>订单号：${order.id}</p>
              <p>下单时间：${orderDate}</p>
              <p>订单状态：${renderOrderStatus(order.status)}</p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">商品列表</h4>
            <div class="space-y-2">
              ${itemsHTML}
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">收货信息</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p>${order.shipping.name}</p>
              <p>${order.shipping.phone}</p>
              <p>${order.shipping.province} ${order.shipping.city}</p>
              <p>${order.shipping.address}</p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between text-lg font-bold text-gray-900">
              <span>总计：</span>
              <span class="text-indigo-600">¥${order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成快递进度模态框 HTML
 * @param {Object} trackingInfo - 快递信息
 * @returns {string} 快递进度 HTML
 */
function renderTrackingModal(trackingInfo) {
  const updatesHTML = trackingInfo.updates.map((update, index) => {
    const updateDate = new Date(update.time).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="flex items-start ${index < trackingInfo.updates.length - 1 ? 'pb-6' : ''}">
        <div class="flex flex-col items-center mr-4">
          <div class="w-3 h-3 rounded-full ${index === 0 ? 'bg-indigo-600' : 'bg-gray-300'}"></div>
          ${index < trackingInfo.updates.length - 1 ? '<div class="w-0.5 h-full bg-gray-300 mt-2"></div>' : ''}
        </div>
        <div class="flex-1">
          <p class="font-semibold text-gray-900">${update.description || update.status}</p>
          ${update.location ? `<p class="text-sm text-gray-600 mt-1">${update.location}</p>` : ''}
          <p class="text-xs text-gray-500 mt-1">${updateDate}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div id="tracking-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-2xl font-bold text-gray-900">快递进度</h3>
          <button 
            id="close-tracking-modal-btn"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">快递单号：</span>
                <span class="font-mono font-semibold text-gray-900">${trackingInfo.trackingNumber}</span>
              </div>
              <div>
                <span class="text-gray-600">承运商：</span>
                <span class="font-semibold text-gray-900">${trackingInfo.carrier || '待确认'}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h4 class="font-semibold text-gray-900 mb-4">物流跟踪</h4>
            ${trackingInfo.updates.length > 0 ? updatesHTML : '<p class="text-gray-600">暂无物流信息</p>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 初始化用户中心交互
 */
export function initUserCenter() {
  // 退出登录
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
      const confirmed = await showConfirm('确定要退出登录吗？', '退出登录', 'warning');
      if (confirmed) {
        authManager.logout();
        showNotification('已退出登录', 'info');
        setTimeout(() => {
          window.location.href = '../../index.html';
        }, 1000);
      }
    });
  }

  // 查看订单详情
  document.querySelectorAll('.view-order-btn').forEach(button => {
    button.addEventListener('click', function() {
      const orderId = this.getAttribute('data-order-id');
      const order = orderManager.getOrderById(orderId);
      if (order) {
        const modalHTML = renderOrderDetail(order);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const closeBtn = document.getElementById('close-modal-btn');
        const modal = document.getElementById('order-detail-modal');
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.remove();
          });
        }
        
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            modal.remove();
          }
        });
      }
    });
  });

  // 查看物流
  document.querySelectorAll('.view-tracking-btn').forEach(button => {
    button.addEventListener('click', function() {
      const orderId = this.getAttribute('data-order-id');
      const trackingInfo = orderManager.getTrackingProgress(orderId);
      if (trackingInfo) {
        const modalHTML = renderTrackingModal(trackingInfo);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const closeBtn = document.getElementById('close-tracking-modal-btn');
        const modal = document.getElementById('tracking-modal');
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            modal.remove();
          });
        }
        
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            modal.remove();
          }
        });
      }
    });
  });
}
