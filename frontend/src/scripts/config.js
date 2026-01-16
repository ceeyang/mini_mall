/**
 * 前端配置模块
 * 从环境变量或默认值加载配置
 */

/**
 * 获取环境变量值
 * 优先级：window.ENV > meta 标签 > localStorage > 默认值
 * @param {string} key - 环境变量键名
 * @param {string} defaultValue - 默认值
 * @returns {string} 环境变量值
 */
function getEnv(key, defaultValue = '') {
  // 1. 从 window.ENV 对象获取（通过脚本注入）
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }

  // 2. 从 meta 标签获取
  const metaTag = document.querySelector(`meta[name="env-${key}"]`);
  if (metaTag) {
    return metaTag.getAttribute('content') || defaultValue;
  }

  // 3. 从 localStorage 获取（用于运行时配置）
  const stored = localStorage.getItem(`env_${key}`);
  if (stored) {
    return stored;
  }

  // 4. 返回默认值
  return defaultValue;
}

/**
 * 智能检测 API 基础 URL
 * - 开发环境（localhost:8080）：使用 http://localhost:3000/api
 * - 生产环境（通过 Nginx）：使用相对路径 /api
 */
function getDefaultApiBaseUrl() {
  // 直接检查环境变量（不通过 getEnv 避免递归）
  // 1. 从 window.ENV 对象获取
  if (typeof window !== 'undefined' && window.ENV && window.ENV.API_BASE_URL) {
    return window.ENV.API_BASE_URL;
  }
  
  // 2. 从 meta 标签获取
  const metaTag = document.querySelector('meta[name="env-API_BASE_URL"]');
  if (metaTag) {
    const value = metaTag.getAttribute('content');
    if (value) return value;
  }
  
  // 3. 从 localStorage 获取
  const stored = localStorage.getItem('env_API_BASE_URL');
  if (stored) {
    return stored;
  }
  
  // 4. 检测当前运行环境
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // 开发环境：localhost 或 127.0.0.1，且端口为 8080
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '8080') {
      return 'http://localhost:3000/api';
    }
  }
  
  // 生产环境：使用相对路径（通过 Nginx 代理）
  return '/api';
}

/**
 * 前端配置对象
 */
export const config = {
  // API 基础 URL（智能检测：开发环境使用绝对路径，生产环境使用相对路径）
  API_BASE_URL: getDefaultApiBaseUrl(),
  
  // 前端 URL
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),
};

/**
 * 设置运行时配置（存储在 localStorage）
 * @param {string} key - 配置键名
 * @param {string} value - 配置值
 */
export function setConfig(key, value) {
  localStorage.setItem(`env_${key}`, value);
  // 更新 config 对象
  if (config.hasOwnProperty(key)) {
    config[key] = value;
  }
}

/**
 * 清除运行时配置
 * @param {string} key - 配置键名
 */
export function clearConfig(key) {
  localStorage.removeItem(`env_${key}`);
  // 重置为默认值
  if (key === 'API_BASE_URL') {
    config.API_BASE_URL = getDefaultApiBaseUrl();
  } else if (key === 'FRONTEND_URL') {
    config.FRONTEND_URL = 'http://localhost:8080';
  }
}

export default config;
