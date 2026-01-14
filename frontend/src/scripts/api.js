/**
 * API 配置和工具模块
 * 提供统一的 API 调用接口
 */

import { config } from './config.js';

// API 基础配置
const API_CONFIG = {
  // 后端 API 基础 URL（从 config 模块获取）
  BASE_URL: config.API_BASE_URL,
};

/**
 * 获取完整的 API URL
 * @param {string} endpoint - API 端点
 * @returns {string} 完整的 API URL
 */
export function getApiUrl(endpoint) {
  // 移除 endpoint 开头的斜杠（如果有）
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
}

/**
 * 获取认证头
 * @returns {Object} 包含 Authorization 头的对象
 */
export function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem('miniMallUser') || 'null');
  const token = user?.token;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * 通用 API 请求函数
 * @param {string} endpoint - API 端点
 * @param {Object} options - fetch 选项
 * @returns {Promise<Object>} API 响应数据
 */
export async function apiRequest(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 处理非 JSON 响应（如重定向）
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: response.ok,
        status: response.status,
        data: null,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data.message || '请求失败',
        errors: data.errors,
        data: null,
      };
    }

    return {
      success: true,
      status: response.status,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API 请求错误:', error);
    return {
      success: false,
      message: '网络错误，请检查后端服务是否运行',
      error: error.message,
    };
  }
}

/**
 * GET 请求
 * @param {string} endpoint - API 端点
 * @param {Object} params - 查询参数
 * @returns {Promise<Object>} API 响应数据
 */
export async function apiGet(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiRequest(url, { method: 'GET' });
}

/**
 * POST 请求
 * @param {string} endpoint - API 端点
 * @param {Object} body - 请求体
 * @returns {Promise<Object>} API 响应数据
 */
export async function apiPost(endpoint, body = {}) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT 请求
 * @param {string} endpoint - API 端点
 * @param {Object} body - 请求体
 * @returns {Promise<Object>} API 响应数据
 */
export async function apiPut(endpoint, body = {}) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE 请求
 * @param {string} endpoint - API 端点
 * @returns {Promise<Object>} API 响应数据
 */
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}
