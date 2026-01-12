/**
 * 购物车页面入口文件
 * 初始化购物车页面的所有组件
 */

import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderCart, initCart } from '../components/cart.js';
import { renderFooter } from '../components/footer.js';
import { initUI } from './ui.js';
import { cartManager } from './cart.js';

/**
 * 初始化购物车页面
 */
function initCartPage() {
  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar();
    initNavbar();
  }

  // 渲染购物车
  const cartContainer = document.getElementById('cart-container');
  if (cartContainer) {
    cartContainer.innerHTML = renderCart();
    initCart();
  }

  // 渲染页脚
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }

  // 初始化 UI 功能
  initUI();

  // 监听购物车变化，更新购物车显示和导航栏
  cartManager.onCartChange(() => {
    // 更新购物车显示
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
      cartContainer.innerHTML = renderCart();
      initCart();
    }

    // 更新导航栏
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar();
      initNavbar();
    }
  });
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartPage);
} else {
  initCartPage();
}
