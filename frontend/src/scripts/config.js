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
 * 前端配置对象
 */
export const config = {
  // API 基础 URL
  API_BASE_URL: getEnv('API_BASE_URL', 'http://localhost:3000/api'),
  
  // 前端 URL
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:8080'),
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
    config.API_BASE_URL = 'http://localhost:3000/api';
  } else if (key === 'FRONTEND_URL') {
    config.FRONTEND_URL = 'http://localhost:8080';
  }
}

export default config;
