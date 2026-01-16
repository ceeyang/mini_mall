/**
 * 前端配置模块
 * 
 * 若要修改 API 地址：
 * 1. 开发环境：通常使用 'http://localhost:8080/api'
 * 2. 生产环境：线上部署时修改为 'http://180.76.135.184:8080/api' 或相对路径 '/api'
 */

export const config = {
  // 开发环境配置
  // API_BASE_URL: 'http://localhost:8080/api',

  // 生产环境配置 (注释掉上方配置，启用下方配置)
  API_BASE_URL: 'http://180.76.135.184:8080/api',

  // 前端地址
  FRONTEND_URL: 'http://localhost:3000',
};

// 保持兼容性的空函数
export function setConfig(key, value) {
  console.warn('setConfig takes no effect in static config mode');
}

export function clearConfig(key) {
  console.warn('clearConfig takes no effect in static config mode');
}

export default config;
