/**
 * 主入口文件
 * 初始化所有模块和组件
 */

import { renderAbout } from '../components/about.js';
import { renderContact } from '../components/contact.js';
import { renderFooter } from '../components/footer.js';
import { renderHero } from '../components/hero.js';
import { initNavbar, renderNavbar } from '../components/navbar.js';
import { initProducts, renderProducts } from '../components/products.js';
import { cartManager } from './cart.js';
import { initUI } from './ui.js';

/**
 * 初始化应用
 */
function initApp() {
  // 渲染所有组件
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar('index');
    initNavbar();
  }

  const heroContainer = document.getElementById('hero-container');
  if (heroContainer) {
    heroContainer.innerHTML = renderHero();
  }

  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    // 首页只显示前3个商品，并显示"更多商品"按钮
    renderProducts(3).then(html => {
      productsContainer.innerHTML = html;
      initProducts();
    }).catch(error => {
      console.error('加载商品失败:', error);
      productsContainer.innerHTML = '<div class="text-center py-12 text-gray-500">商品加载失败，请稍后重试</div>';
    });
  }

  const aboutContainer = document.getElementById('about-container');
  if (aboutContainer) {
    // 首页版本，传入 false
    aboutContainer.innerHTML = renderAbout(false);
  }

  const contactContainer = document.getElementById('contact-container');
  if (contactContainer) {
    // 首页版本，传入 false
    contactContainer.innerHTML = renderContact(false);
  }

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
      navbarContainer.innerHTML = renderNavbar('index');
      initNavbar();
    }
  });
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
