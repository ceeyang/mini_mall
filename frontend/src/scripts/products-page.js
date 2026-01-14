/**
 * 商品列表页面入口文件
 * 初始化商品列表页面的所有组件
 */

import { renderFooter } from '../components/footer.js';
import { initNavbar, renderNavbar } from '../components/navbar.js';
import { initProductsList, renderProductsList } from '../components/products-list.js';
import { cartManager } from './cart.js';
import { initUI } from './ui.js';

/**
 * 初始化商品列表页面
 */
function initProductsPage() {
  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar('pages');
    initNavbar();
  }

  // 渲染商品列表
  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    renderProductsList().then(html => {
      productsContainer.innerHTML = html;
      initProductsList();
    }).catch(error => {
      console.error('加载商品列表失败:', error);
      productsContainer.innerHTML = '<div class="text-center py-12 text-gray-500">商品列表加载失败，请稍后重试</div>';
    });
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
