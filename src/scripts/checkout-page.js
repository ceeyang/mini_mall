/**
 * 结算页面入口文件
 * 初始化结算页面的所有组件
 */

import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderCheckout, initCheckout } from '../components/checkout.js';
import { renderFooter } from '../components/footer.js';
import { initUI } from './ui.js';
import { cartManager } from './cart.js';

/**
 * 初始化结算页面
 */
function initCheckoutPage() {
  // 检查购物车是否为空
  if (cartManager.isEmpty()) {
    // 如果购物车为空，3秒后跳转到商品页面
    setTimeout(() => {
      window.location.href = 'products.html';
    }, 3000);
  }

  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar();
    initNavbar();
  }

  // 渲染结算页面
  const checkoutContainer = document.getElementById('checkout-container');
  if (checkoutContainer) {
    checkoutContainer.innerHTML = renderCheckout();
    initCheckout();
  }

  // 渲染页脚
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }

  // 初始化 UI 功能
  initUI();

  // 监听购物车变化，更新结算页面
  cartManager.onCartChange(() => {
    const checkoutContainer = document.getElementById('checkout-container');
    if (checkoutContainer) {
      checkoutContainer.innerHTML = renderCheckout();
      initCheckout();
    }
  });
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCheckoutPage);
} else {
  initCheckoutPage();
}
