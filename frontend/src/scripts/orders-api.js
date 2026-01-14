/**
 * 订单 API 服务模块
 * 处理订单相关的 API 调用
 */

import { apiGet, apiPost, apiPut, apiPatch } from './api.js';

/**
 * 订单 API 服务类
 */
class OrdersAPI {
  /**
   * 创建订单
   * @param {Object} orderData - 订单数据
   * @returns {Promise<Object>} 创建的订单
   */
  async createOrder(orderData) {
    try {
      const result = await apiPost('orders', orderData);
      
      if (result.success && result.data) {
        return result.data.order;
      }
      
      throw new Error(result.message || '订单创建失败');
    } catch (error) {
      console.error('创建订单错误:', error);
      throw error;
    }
  }

  /**
   * 获取用户订单列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.limit - 每页数量
   * @param {string} params.status - 订单状态筛选
   * @returns {Promise<Object>} 订单列表和分页信息
   */
  async getOrders(params = {}) {
    try {
      const result = await apiGet('orders', params);
      
      if (result.success && result.data) {
        return {
          orders: result.data.orders || [],
          pagination: result.data.pagination || {}
        };
      }
      
      return {
        orders: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      };
    } catch (error) {
      console.error('获取订单列表错误:', error);
      return {
        orders: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      };
    }
  }

  /**
   * 获取订单详情
   * @param {string} orderId - 订单 ID
   * @returns {Promise<Object|null>} 订单对象
   */
  async getOrderById(orderId) {
    try {
      const result = await apiGet(`orders/${orderId}`);
      
      if (result.success && result.data) {
        return result.data.order;
      }
      
      return null;
    } catch (error) {
      console.error('获取订单详情错误:', error);
      return null;
    }
  }

  /**
   * 更新订单状态（仅管理员）
   * @param {string} orderId - 订单 ID
   * @param {Object} updateData - 更新数据
   * @returns {Promise<Object>} 更新后的订单
   */
  async updateOrderStatus(orderId, updateData) {
    try {
      const result = await apiPatch(`orders/${orderId}/status`, updateData);
      
      if (result.success && result.data) {
        return result.data.order;
      }
      
      throw new Error(result.message || '订单状态更新失败');
    } catch (error) {
      console.error('更新订单状态错误:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const ordersAPI = new OrdersAPI();
