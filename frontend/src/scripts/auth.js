/**
 * 用户认证模块
 * 处理用户登录、注册、Google OAuth 等认证相关功能
 */

import { apiPost, apiGet } from './api.js';
import { config } from './config.js';

/**
 * 用户认证管理类
 */
class AuthManager {
  constructor() {
    // 从 localStorage 加载用户信息
    this.currentUser = this.loadUser();
    this.listeners = [];
  }

  /**
   * 从 localStorage 加载用户信息
   * @returns {Object|null} 用户对象或 null
   */
  loadUser() {
    const stored = localStorage.getItem('miniMallUser');
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * 保存用户信息到 localStorage
   * @param {Object} user - 用户对象
   * @param {string} token - JWT token
   */
  saveUser(user, token = null) {
    const userData = {
      ...user,
      token: token || user.token,
    };
    localStorage.setItem('miniMallUser', JSON.stringify(userData));
    this.currentUser = userData;
    this.notifyListeners();
  }

  /**
   * 清除用户信息
   */
  clearUser() {
    localStorage.removeItem('miniMallUser');
    this.currentUser = null;
    this.notifyListeners();
  }

  /**
   * 用户登录
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  async login(email, password) {
    try {
      const result = await apiPost('auth/login', { email, password });
      
      if (result.success && result.data) {
        const { user, token } = result.data;
        this.saveUser(user, token);
        return { success: true, user: { ...user, token } };
      }
      
      return { 
        success: false, 
        message: result.message || '登录失败，请检查邮箱和密码' 
      };
    } catch (error) {
      console.error('登录错误:', error);
      return { success: false, message: '登录失败，请稍后重试' };
    }
  }

  /**
   * 用户注册
   * @param {string} name - 姓名
   * @param {string} email - 邮箱
   * @param {string} password - 密码
   * @returns {Promise<Object>} 注册结果
   */
  async register(name, email, password) {
    try {
      const result = await apiPost('auth/register', { name, email, password });
      
      if (result.success && result.data) {
        const { user, token } = result.data;
        this.saveUser(user, token);
        return { success: true, user: { ...user, token } };
      }
      
      return { 
        success: false, 
        message: result.message || '注册失败，请检查输入信息' 
      };
    } catch (error) {
      console.error('注册错误:', error);
      return { success: false, message: '注册失败，请稍后重试' };
    }
  }

  /**
   * Google OAuth 登录
   * @returns {Promise<Object>} 登录结果
   */
  async loginWithGoogle() {
    try {
      // 重定向到后端 Google OAuth 入口
      // 使用配置中的 API 基础 URL
      window.location.href = `${config.API_BASE_URL}/auth/google`;
      // 注意：Google OAuth 会重定向回前端，token 会在 URL 参数中
      return { success: true, redirect: true };
    } catch (error) {
      console.error('Google 登录错误:', error);
      return { success: false, message: 'Google 登录失败，请稍后重试' };
    }
  }

  /**
   * 用户登出
   */
  logout() {
    this.clearUser();
  }

  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * 获取当前用户
   * @returns {Object|null} 当前用户对象或 null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * 注册认证状态变化监听器
   * @param {Function} callback - 回调函数
   */
  onAuthChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser));
  }
}

// 导出单例实例
export const authManager = new AuthManager();
