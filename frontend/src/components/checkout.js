/**
 * 结算页面组件
 * 生成结算界面并处理订单和支付相关交互
 */

import { cartManager } from '../scripts/cart.js';
import { showNotification } from '../scripts/ui.js';
import { paymentService } from '../scripts/payment.js';
import { orderManager } from '../scripts/orders.js';
import { authManager } from '../scripts/auth.js';

/**
 * 生成订单摘要 HTML
 * @returns {string} 订单摘要 HTML 字符串
 */
function renderOrderSummary() {
  const cartItems = cartManager.getItems();
  const subtotal = cartManager.getTotalPrice();
  const shipping = subtotal > 0 ? 10 : 0; // 运费示例：10元
  const total = subtotal + shipping;

  if (cartManager.isEmpty()) {
    return `
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-2">购物车是空的</h3>
        <p class="text-gray-600 mb-6">请先添加商品到购物车</p>
        <a href="products.html" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
          去购物
        </a>
      </div>
    `;
  }

  const itemsHTML = cartItems.map(item => `
    <div class="flex items-center justify-between py-3 border-b border-gray-200">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900">${item.name}</h4>
        <p class="text-sm text-gray-600">¥${item.price} × ${item.quantity}</p>
      </div>
      <span class="font-bold text-gray-900">¥${item.price * item.quantity}</span>
    </div>
  `).join('');

  return `
    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 class="text-xl font-bold text-gray-900 mb-4">订单摘要</h3>
      <div class="space-y-2 mb-4">
        ${itemsHTML}
      </div>
      <div class="border-t border-gray-200 pt-4 space-y-2">
        <div class="flex justify-between text-gray-600">
          <span>小计</span>
          <span>¥${subtotal}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>运费</span>
          <span>¥${shipping}</span>
        </div>
        <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
          <span>总计</span>
          <span class="text-indigo-600">¥${total}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 生成结算区域 HTML
 * @returns {string} 结算区域 HTML 字符串
 */
export function renderCheckout() {
  // 检查是否已登录
  if (!authManager.isAuthenticated()) {
    return `
      <section id="checkout" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
          <p class="text-gray-600 mb-6">登录后即可进行结算</p>
          <a href="login.html?return=checkout.html" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium">
            立即登录
          </a>
        </div>
      </section>
    `;
  }

  if (cartManager.isEmpty()) {
    return `
      <section id="checkout" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        ${renderOrderSummary()}
      </section>
    `;
  }

  return `
    <section id="checkout" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">结算</h1>
        <p class="text-gray-600">请填写您的订单信息</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：订单信息表单 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 收货信息 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">收货信息</h2>
            <form id="shipping-form" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-2">收货人姓名 *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="请输入收货人姓名">
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">联系电话 *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="请输入联系电话">
                </div>
              </div>
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">详细地址 *</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="请输入详细地址">
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="province" class="block text-sm font-medium text-gray-700 mb-2">省份 *</label>
                  <input 
                    type="text" 
                    id="province" 
                    name="province" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="省份">
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-2">城市 *</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="城市">
                </div>
                <div>
                  <label for="postal" class="block text-sm font-medium text-gray-700 mb-2">邮编</label>
                  <input 
                    type="text" 
                    id="postal" 
                    name="postal"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="邮编">
                </div>
              </div>
            </form>
          </div>

          <!-- 支付方式 -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">支付方式</h2>
            <div id="payment-methods" class="space-y-3">
              <!-- 支付方式选项将通过 JavaScript 动态生成 -->
            </div>
          </div>
        </div>

        <!-- 右侧：订单摘要 -->
        <div class="lg:col-span-1">
          ${renderOrderSummary()}
        </div>
      </div>

      <!-- 提交订单按钮 -->
      <div class="mt-8 flex justify-end space-x-4">
        <a href="cart.html" class="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 cursor-pointer font-medium">
          返回购物车
        </a>
        <button 
          id="submit-order-btn"
          class="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium shadow-lg">
          提交订单
        </button>
      </div>
    </section>
  `;
}

/**
 * 初始化结算页面交互
 */
export function initCheckout() {
  // 渲染支付方式
  renderPaymentMethods();

  // 提交订单
  const submitBtn = document.getElementById('submit-order-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async function() {
      await handleOrderSubmit();
    });
  }
}

/**
 * 渲染支付方式选项
 */
function renderPaymentMethods() {
  const paymentMethodsContainer = document.getElementById('payment-methods');
  if (!paymentMethodsContainer) return;

  const methods = paymentService.getAvailableMethods();
  
  const methodsHTML = methods.map((method, index) => `
    <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-200 ${index === 0 ? 'border-indigo-500 bg-indigo-50' : ''}">
      <input 
        type="radio" 
        name="payment-method" 
        value="${method.id}" 
        class="mr-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
        ${index === 0 ? 'checked' : ''}>
      <div class="flex items-center flex-1">
        ${method.icon}
        <span class="ml-3 font-medium text-gray-900">${method.name}</span>
      </div>
    </label>
  `).join('');

  paymentMethodsContainer.innerHTML = methodsHTML;

  // 监听支付方式选择变化
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // 更新选中样式
      document.querySelectorAll('label').forEach(label => {
        label.classList.remove('border-indigo-500', 'bg-indigo-50');
        label.classList.add('border-gray-200');
      });
      if (this.checked) {
        this.closest('label').classList.add('border-indigo-500', 'bg-indigo-50');
        this.closest('label').classList.remove('border-gray-200');
      }
    });
  });
}

/**
 * 处理订单提交
 */
async function handleOrderSubmit() {
  // 验证表单
  const shippingForm = document.getElementById('shipping-form');
  if (!shippingForm.checkValidity()) {
    shippingForm.reportValidity();
    return;
  }

  // 获取表单数据
  const formData = new FormData(shippingForm);
  const shippingInfo = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    province: formData.get('province'),
    city: formData.get('city'),
    postal: formData.get('postal')
  };

  // 获取选中的支付方式
  const selectedPayment = document.querySelector('input[name="payment-method"]:checked');
  if (!selectedPayment) {
    showNotification('请选择支付方式', 'error');
    return;
  }

  const paymentMethod = selectedPayment.value;

  // 构建订单数据
  const order = {
    items: cartManager.getItems(),
    shipping: shippingInfo,
    paymentMethod: paymentMethod,
    subtotal: cartManager.getTotalPrice(),
    shippingFee: 10,
    total: cartManager.getTotalPrice() + 10,
    timestamp: new Date().toISOString()
  };

  // 显示加载状态
  const submitBtn = document.getElementById('submit-order-btn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '处理中...';

  try {
    // 调用支付服务
    const result = await paymentService.processPayment(order, paymentMethod);
    
    if (result.success) {
      // 支付成功，创建订单
      try {
        const createdOrder = orderManager.createOrder(order);
        showNotification('订单提交成功！', 'success');
        
        // 清空购物车
        cartManager.clearCart();
        
        // 跳转到用户中心查看订单
        setTimeout(() => {
          window.location.href = 'user-center.html';
        }, 2000);
      } catch (error) {
        console.error('创建订单错误:', error);
        showNotification('订单创建失败，请联系客服', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    } else {
      // 支付失败
      showNotification(result.message || '支付失败，请重试', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error('支付处理错误:', error);
    showNotification('支付处理出错，请稍后重试', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}
