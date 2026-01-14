/**
 * UI 交互模块
 * 处理页面交互、动画、导航等 UI 相关功能
 */

import { showAlert } from './modal.js';

/**
 * 初始化平滑滚动
 */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * 初始化表单处理
 */
export function initFormHandling() {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await showAlert('感谢您的留言！我们会尽快与您联系。', '提交成功', 'success');
      this.reset();
    });
  }
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型：'success', 'error', 'info'
 */
export function showNotification(message, type = 'success') {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  } text-white`;
  notification.textContent = message;
  
  // 添加到页面
  document.body.appendChild(notification);
  
  // 显示动画
  setTimeout(() => {
    notification.classList.add('translate-x-0', 'opacity-100');
    notification.classList.remove('-translate-x-full', 'opacity-0');
  }, 10);
  
  // 3秒后移除
  setTimeout(() => {
    notification.classList.add('-translate-x-full', 'opacity-0');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/**
 * 初始化所有 UI 功能
 */
export function initUI() {
  initSmoothScroll();
  initFormHandling();
}
