/**
 * 主入口文件
 * 初始化所有模块和组件
 */

import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderHero } from '../components/hero.js';
import { renderProducts, initProducts } from '../components/products.js';
import { renderCart, initCart } from '../components/cart.js';
import { renderAbout } from '../components/about.js';
import { renderContact } from '../components/contact.js';
import { renderFooter } from '../components/footer.js';
import { initUI } from './ui.js';
import { cartManager } from './cart.js';

/**
 * 初始化应用
 */
function initApp() {
  // 渲染所有组件
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar();
    initNavbar();
  }

  const heroContainer = document.getElementById('hero-container');
  if (heroContainer) {
    heroContainer.innerHTML = renderHero();
  }

  const productsContainer = document.getElementById('products-container');
  if (productsContainer) {
    // 首页只显示前3个商品，并显示"更多商品"按钮
    productsContainer.innerHTML = renderProducts(3);
    initProducts();
  }

  const aboutContainer = document.getElementById('about-container');
  if (aboutContainer) {
    aboutContainer.innerHTML = renderAbout();
  }

  const contactContainer = document.getElementById('contact-container');
  if (contactContainer) {
    contactContainer.innerHTML = renderContact();
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
      navbarContainer.innerHTML = renderNavbar();
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
