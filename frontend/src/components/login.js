/**
 * 登录组件
 * 生成登录/注册界面并处理认证相关交互
 */

import { authManager } from '../scripts/auth.js';
import { showNotification } from '../scripts/ui.js';

/**
 * 生成登录区域 HTML
 * @param {boolean} isLoginMode - 是否为登录模式，true=登录，false=注册
 * @returns {string} 登录区域 HTML 字符串
 */
export function renderLogin(isLoginMode = true) {
  const modeText = isLoginMode ? '登录' : '注册';
  const switchText = isLoginMode ? '还没有账号？' : '已有账号？';
  const switchLinkText = isLoginMode ? '立即注册' : '立即登录';
  const switchMode = isLoginMode ? 'register' : 'login';

  return `
    <section id="login" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">${modeText}</h1>
          <p class="text-gray-600">${isLoginMode ? '欢迎回来！' : '创建您的账号'}</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <!-- Google 登录按钮 -->
          <button 
            id="google-login-btn"
            class="w-full flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer font-medium mb-6">
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 账号${modeText}
          </button>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>

          <!-- 登录/注册表单 -->
          <form id="auth-form" class="space-y-4">
            ${!isLoginMode ? `
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  ${!isLoginMode ? 'required' : ''}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="请输入您的姓名">
              </div>
            ` : ''}
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="your@email.com">
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="请输入密码">
            </div>

            ${isLoginMode ? `
              <div class="flex items-center justify-between">
                <label class="flex items-center">
                  <input type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                  <span class="ml-2 text-sm text-gray-600">记住我</span>
                </label>
                <a href="#" class="text-sm text-indigo-600 hover:text-indigo-700">忘记密码？</a>
              </div>
            ` : ''}

            <button 
              type="submit"
              id="submit-btn"
              class="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer font-medium shadow-lg">
              ${modeText}
            </button>
          </form>

          <div class="mt-6 text-center">
            <span class="text-gray-600">${switchText}</span>
            <button 
              id="switch-mode-btn"
              class="ml-2 text-indigo-600 hover:text-indigo-700 transition-colors duration-200 cursor-pointer font-medium"
              data-mode="${switchMode}">
              ${switchLinkText}
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * 初始化登录组件交互
 */
export function initLogin() {
  // 从 URL 参数或表单容器获取当前模式（默认为登录模式）
  const urlParams = new URLSearchParams(window.location.search);
  const modeFromUrl = urlParams.get('mode');
  const loginContainer = document.getElementById('login-container');
  const currentMode = loginContainer?.getAttribute('data-mode') || modeFromUrl || 'login';
  let isLoginMode = currentMode === 'login';

  // 在容器上保存当前模式，以便切换时能正确读取
  if (loginContainer) {
    loginContainer.setAttribute('data-mode', isLoginMode ? 'login' : 'register');
  }

  // 切换登录/注册模式
  const switchModeBtn = document.getElementById('switch-mode-btn');
  if (switchModeBtn) {
    switchModeBtn.addEventListener('click', function() {
      const newMode = this.getAttribute('data-mode') === 'login';
      const loginContainer = document.getElementById('login-container');
      if (loginContainer) {
        // 保存新模式到容器属性
        loginContainer.setAttribute('data-mode', newMode ? 'login' : 'register');
        loginContainer.innerHTML = renderLogin(newMode);
        initLogin();
      }
    });
  }

  // Google 登录
  const googleLoginBtn = document.getElementById('google-login-btn');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async function() {
      const originalText = this.textContent;
      this.disabled = true;
      this.textContent = '处理中...';

      const result = await authManager.loginWithGoogle();
      
      if (result.success) {
        showNotification('登录成功！', 'success');
        // 跳转到用户中心或返回上一页
        setTimeout(() => {
          const returnUrl = new URLSearchParams(window.location.search).get('return') || 'user-center.html';
          window.location.href = returnUrl;
        }, 1000);
      } else {
        showNotification(result.message || '登录失败，请重试', 'error');
        this.disabled = false;
        this.textContent = originalText;
      }
    });
  }

  // 表单提交
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // 从表单容器获取当前模式（确保获取最新状态）
      // 如果容器没有 data-mode 属性，则通过检查是否存在姓名输入框来判断
      const loginContainer = document.getElementById('login-container');
      let currentMode = loginContainer?.getAttribute('data-mode');
      
      // 如果容器没有保存模式，通过检查表单中是否有姓名输入框来判断
      if (!currentMode) {
        const nameInput = document.getElementById('name');
        currentMode = nameInput ? 'register' : 'login';
      }
      
      const isCurrentlyLoginMode = currentMode === 'login';
      
      const formData = new FormData(this);
      const email = formData.get('email');
      const password = formData.get('password');
      const name = formData.get('name');

      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '处理中...';

      let result;
      if (isCurrentlyLoginMode) {
        result = await authManager.login(email.trim(), password);
      } else {
        if (!name || name.trim() === '') {
          showNotification('请输入姓名', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }
        result = await authManager.register(name.trim(), email.trim(), password);
      }

      if (result.success) {
        showNotification(isCurrentlyLoginMode ? '登录成功！' : '注册成功！', 'success');
        setTimeout(() => {
          const returnUrl = new URLSearchParams(window.location.search).get('return') || 'user-center.html';
          window.location.href = returnUrl;
        }, 1000);
      } else {
        // 显示错误信息，如果有验证错误详情，也一并显示
        let errorMessage = result.message || (isCurrentlyLoginMode ? '登录失败，请重试' : '注册失败，请重试');
        if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          // 如果有多个错误，显示第一个
          const firstError = result.errors[0];
          if (firstError.msg) {
            errorMessage = firstError.msg;
          }
        }
        showNotification(errorMessage, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}
