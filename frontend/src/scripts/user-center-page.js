/**
 * 用户中心页面入口文件
 * 初始化用户中心页面的所有组件
 */

import { renderNavbar, initNavbar } from '../components/navbar.js';
import { renderUserCenter, initUserCenter } from '../components/user-center.js';
import { renderFooter } from '../components/footer.js';
import { initUI } from './ui.js';
import { cartManager } from './cart.js';
import { authManager } from './auth.js';

/**
 * 更新用户中心显示
 */
async function updateUserCenter() {
  const userCenterContainer = document.getElementById('user-center-container');
  if (userCenterContainer) {
    const html = await renderUserCenter();
    userCenterContainer.innerHTML = html;
    initUserCenter();
  }
}

/**
 * 初始化用户中心页面
 */
function initUserCenterPage() {
  // 如果未登录，跳转到登录页
  if (!authManager.isAuthenticated()) {
    window.location.href = 'login.html?return=user-center.html';
    return;
  }

  // 渲染导航栏
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar('pages');
    initNavbar();
  }

  // 渲染用户中心
  const userCenterContainer = document.getElementById('user-center-container');
  if (userCenterContainer) {
    renderUserCenter().then(html => {
      userCenterContainer.innerHTML = html;
      initUserCenter();
    }).catch(error => {
      console.error('渲染用户中心失败:', error);
      userCenterContainer.innerHTML = '<div class="text-center py-12 text-gray-500">加载失败，请稍后重试</div>';
    });
  }

  // 渲染页脚
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = renderFooter();
  }

  // 初始化 UI 功能
  initUI();

  // 监听认证状态变化
  authManager.onAuthChange(() => {
    updateUserCenter();
    // 更新导航栏
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
      navbarContainer.innerHTML = renderNavbar();
      initNavbar();
    }
  });

  // 订单变化时刷新（通过重新获取数据）
  // 注意：不再使用 localStorage 的 orderManager，改为从后端 API 获取

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
  document.addEventListener('DOMContentLoaded', initUserCenterPage);
} else {
  initUserCenterPage();
}
