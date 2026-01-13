/**
 * 用户认证模块
 * 处理用户登录、注册、Google OAuth 等认证相关功能
 */

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
   */
  saveUser(user) {
    localStorage.setItem('miniMallUser', JSON.stringify(user));
    this.currentUser = user;
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
      // TODO: 调用后端 API 进行登录验证
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   this.saveUser(data.user);
      //   return { success: true, user: data.user };
      // }
      // return { success: false, message: data.message };

      // 当前为模拟实现（仅用于演示）
      // 实际使用时需要替换为真实的后端 API 调用
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            avatar: null,
            loginMethod: 'email',
            createdAt: new Date().toISOString()
          };
          this.saveUser(user);
          resolve({ success: true, user: user });
        }, 1000);
      });
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
      // TODO: 调用后端 API 进行注册
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   this.saveUser(data.user);
      //   return { success: true, user: data.user };
      // }
      // return { success: false, message: data.message };

      // 当前为模拟实现
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: Date.now(),
            name: name,
            email: email,
            avatar: null,
            loginMethod: 'email',
            createdAt: new Date().toISOString()
          };
          this.saveUser(user);
          resolve({ success: true, user: user });
        }, 1000);
      });
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
      // TODO: 集成 Google OAuth
      // 参考文档: https://developers.google.com/identity/protocols/oauth2
      
      // 示例：使用 Google Identity Services
      // const client = google.accounts.oauth2.initTokenClient({
      //   client_id: 'YOUR_GOOGLE_CLIENT_ID',
      //   scope: 'email profile',
      //   callback: async (response) => {
      //     // 获取用户信息
      //     const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      //       headers: { 'Authorization': `Bearer ${response.access_token}` }
      //     }).then(r => r.json());
      //     
      //     // 调用后端 API 创建或登录用户
      //     const backendResponse = await fetch('/api/auth/google', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ googleUser: userInfo })
      //     });
      //     const data = await backendResponse.json();
      //     if (data.success) {
      //       this.saveUser(data.user);
      //       return { success: true, user: data.user };
      //     }
      //   }
      // });
      // client.requestAccessToken();

      // 当前为模拟实现
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: Date.now(),
            email: 'user@gmail.com',
            name: 'Google User',
            avatar: 'https://via.placeholder.com/100',
            loginMethod: 'google',
            googleId: 'google_' + Date.now(),
            createdAt: new Date().toISOString()
          };
          this.saveUser(user);
          resolve({ success: true, user: user });
        }, 1500);
      });
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
