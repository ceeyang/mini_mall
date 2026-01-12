/**
 * 商品列表页面入口文件
 * 初始化商品列表页面的所有组件
 */

import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderProductsList, initProductsList } from '../components/products-list.js';
import { renderFooter } from '../components/footer.js';
import { initUI } from './ui.js';
import { cartManager } from './cart.js';

/**
 * 初始化商品列表页面
 */
function initProductsPage() {
  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar();
    initNavbar();
  }

  // 渲染商品列表
  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    productsContainer.innerHTML = renderProductsList();
    initProductsList();
  }

  // 渲染页脚
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }

  // 初始化 UI 功能
  initUI();

  // 监听购物车变化，更新导航栏购物车数量
  cartManager.onCartChange(() => {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar();
      initNavbar();
    }
  });
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage);
} else {
  initProductsPage();
}
