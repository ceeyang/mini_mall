/**
 * 订单管理模块
 * 处理订单的创建、查询、快递进度等功能
 */

import { authManager } from './auth.js';

/**
 * 订单管理类
 */
class OrderManager {
  constructor() {
    // 从 localStorage 加载订单数据
    this.orders = this.loadOrders();
    this.listeners = [];
  }

  /**
   * 从 localStorage 加载订单
   * @returns {Array} 订单数组
   */
  loadOrders() {
    const stored = localStorage.getItem('miniMallOrders');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * 保存订单到 localStorage
   */
  saveOrders() {
    localStorage.setItem('miniMallOrders', JSON.stringify(this.orders));
    this.notifyListeners();
  }

  /**
   * 创建订单
   * @param {Object} orderData - 订单数据
   * @returns {Object} 创建的订单
   */
  createOrder(orderData) {
    const user = authManager.getCurrentUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    const order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items: orderData.items,
      shipping: orderData.shipping,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      status: 'pending', // pending, paid, processing, shipped, delivered, cancelled
      paymentStatus: 'unpaid', // unpaid, paid, refunded
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracking: {
        number: null,
        carrier: null,
        status: 'pending', // pending, in_transit, out_for_delivery, delivered
        updates: []
      }
    };

    this.orders.unshift(order); // 添加到开头
    this.saveOrders();
    return order;
  }

  /**
   * 获取用户的所有订单
   * @param {number} userId - 用户 ID
   * @returns {Array} 订单数组
   */
  getUserOrders(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  /**
   * 根据订单 ID 获取订单
   * @param {string} orderId - 订单 ID
   * @returns {Object|null} 订单对象或 null
   */
  getOrderById(orderId) {
    return this.orders.find(order => order.id === orderId) || null;
  }

  /**
   * 更新订单状态
   * @param {string} orderId - 订单 ID
   * @param {string} status - 新状态
   */
  updateOrderStatus(orderId, status) {
    const order = this.getOrderById(orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.saveOrders();
    }
  }

  /**
   * 更新快递信息
   * @param {string} orderId - 订单 ID
   * @param {Object} trackingInfo - 快递信息
   */
  updateTracking(orderId, trackingInfo) {
    const order = this.getOrderById(orderId);
    if (order) {
      order.tracking = {
        ...order.tracking,
        ...trackingInfo,
        updates: [
          ...order.tracking.updates,
          {
            status: trackingInfo.status,
            location: trackingInfo.location || '',
            time: new Date().toISOString(),
            description: trackingInfo.description || ''
          }
        ]
      };
      order.updatedAt = new Date().toISOString();
      this.saveOrders();
    }
  }

  /**
   * 获取订单快递进度
   * @param {string} orderId - 订单 ID
   * @returns {Object|null} 快递进度信息
   */
  getTrackingProgress(orderId) {
    const order = this.getOrderById(orderId);
    if (!order || !order.tracking) {
      return null;
    }

    return {
      orderId: order.id,
      trackingNumber: order.tracking.number,
      carrier: order.tracking.carrier,
      status: order.tracking.status,
      updates: order.tracking.updates,
      estimatedDelivery: order.tracking.estimatedDelivery
    };
  }

  /**
   * 注册订单变化监听器
   * @param {Function} callback - 回调函数
   */
  onOrdersChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.orders));
  }
}

// 导出单例实例
export const orderManager = new OrderManager();
