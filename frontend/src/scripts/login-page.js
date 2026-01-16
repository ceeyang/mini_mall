/**
 * 登录页面入口文件
 * 初始化登录页面的所有组件
 */

import { renderFooter } from '../components/footer.js';
import { initLogin, renderLogin } from '../components/login.js';
import { initNavbar, renderNavbar } from '../components/navbar.js';
import { authManager } from './auth.js';
import { cartManager } from './cart.js';
import { initUI } from './ui.js';

/**
 * 初始化登录页面
 */
function initLoginPage() {
  // 如果已登录，跳转到用户中心
  if (authManager.isAuthenticated()) {
    window.location.href = '/user-center';
    return;
  }

  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar('pages');
    initNavbar();
  }

  // 渲染登录组件
  const loginContainer = document.getElementById('auth-container');
  if (loginContainer) {
    loginContainer.innerHTML = renderLogin(true);
    initLogin();
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
      navbarContainer.innerHTML = renderNavbar('pages');
      initNavbar();
    }
  });
}

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
  initLoginPage();
}
