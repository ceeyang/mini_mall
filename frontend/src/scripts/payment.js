/**
 * 支付服务模块
 * 处理支付相关逻辑，预留支付渠道接口
 */

/**
 * 支付服务类
 * 负责处理各种支付方式的集成
 */
class PaymentService {
  constructor() {
    // 可用的支付方式配置
    this.paymentMethods = [
      {
        id: 'alipay',
        name: '支付宝',
        icon: '<svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21.422 5.771c-.213-1.379-1.059-2.541-2.238-3.15C17.833 2.002 15.504 2 12 2H2v2h10c1.376 0 2.375.007 3.335.062.78.033 1.495.16 2.11.435.616.275 1.092.66 1.422 1.13.33.47.495 1.01.495 1.62 0 .83-.319 1.566-.957 2.21-.638.643-1.512 1.12-2.618 1.426l-2.75.734c-1.042.278-1.665.86-1.87 1.746-.205.886.008 1.9.64 3.04.632 1.14 1.609 2.28 2.93 3.42 1.32 1.14 2.97 2.14 4.95 3.002 1.98.86 4.28 1.5 6.9 1.92v-2.02c-2.4-.35-4.4-.9-6-1.66-1.6-.76-2.88-1.7-3.84-2.82-.96-1.12-1.44-2.36-1.44-3.72 0-1.22.4-2.22 1.2-3 .8-.78 1.88-1.3 3.24-1.56l2.75-.734c1.5-.4 2.5-1.02 3-1.86.5-.84.5-1.9 0-3.18z"/></svg>',
        enabled: true
      },
      {
        id: 'wechat',
        name: '微信支付',
        icon: '<svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.35-8.588-6.35zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.554c-1.996 0-3.637 1.517-3.906 3.49-.015.12-.03.24-.03.362 0 2.286 2.037 4.15 4.548 4.15.275 0 .543-.027.811-.05a6.72 6.72 0 0 1-1.18-1.667.59.59 0 0 1 .214-.665l.39-1.48c.019-.07.048-.141.048-.213 0-.163-.13-.295-.29-.295a.326.326 0 0 0-.167.054l-1.903 1.114a.864.864 0 0 1-.717.098c-1.256-.24-2.4-.89-3.22-1.82 1.703-1.415 3.882-1.98 5.853-1.838.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446zm-.344 2.71c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.906 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/></svg>',
        enabled: true
      },
      {
        id: 'stripe',
        name: 'Stripe（信用卡）',
        icon: '<svg class="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 2.081 1.182 3.933 3.007 5.304 1.938 1.41 2.609 2.233 2.609 3.445 0 .98-.84 1.545-2.354 1.545-1.875 0-4.4-.732-5.99-1.842L0 19.732c1.597.922 3.576 1.595 5.713 1.595 2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-2.194-1.031-3.686-2.59-4.632z"/></svg>',
        enabled: true
      }
    ];
  }

  /**
   * 获取可用的支付方式
   * @returns {Array} 支付方式数组
   */
  getAvailableMethods() {
    return this.paymentMethods.filter(method => method.enabled);
  }

  /**
   * 处理支付
   * @param {Object} order - 订单对象
   * @param {string} paymentMethod - 支付方式 ID
   * @returns {Promise<Object>} 支付结果
   */
  async processPayment(order, paymentMethod) {
    console.log('处理支付:', { order, paymentMethod });

    // 根据支付方式调用相应的支付接口
    switch (paymentMethod) {
      case 'alipay':
        return await this.processAlipay(order);
      case 'wechat':
        return await this.processWechatPay(order);
      case 'stripe':
        return await this.processStripe(order);
      default:
        return {
          success: false,
          message: '不支持的支付方式'
        };
    }
  }

  /**
   * 处理支付宝支付
   * @param {Object} order - 订单对象
   * @returns {Promise<Object>} 支付结果
   */
  async processAlipay(order) {
    // 调用后端支付 API
    // 注意：实际支付集成需要根据具体支付平台文档实现
    try {
      const { apiPost } = await import('./api.js');
      const result = await apiPost('payment/process', {
        orderId: order.id || order._id,
        paymentMethod: 'alipay'
      });

      if (result.success) {
        return {
          success: true,
          message: result.message || '支付成功',
          paymentId: result.data?.paymentId,
          orderId: order.id || order._id
        };
      }

      return {
        success: false,
        message: result.message || '支付处理失败，请重试'
      };
    } catch (error) {
      console.error('支付宝支付错误:', error);
      return {
        success: false,
        message: '支付处理失败，请重试'
      };
    }
  }

  /**
   * 处理微信支付
   * @param {Object} order - 订单对象
   * @returns {Promise<Object>} 支付结果
   */
  async processWechatPay(order) {
    // 调用后端支付 API
    // 注意：实际支付集成需要根据具体支付平台文档实现
    try {
      const { apiPost } = await import('./api.js');
      const result = await apiPost('payment/process', {
        orderId: order.id || order._id,
        paymentMethod: 'wechat'
      });

      if (result.success) {
        return {
          success: true,
          message: result.message || '支付成功',
          paymentId: result.data?.paymentId,
          orderId: order.id || order._id
        };
      }

      return {
        success: false,
        message: result.message || '支付处理失败，请重试'
      };
    } catch (error) {
      console.error('微信支付错误:', error);
      return {
        success: false,
        message: '支付处理失败，请重试'
      };
    }
  }

  /**
   * 处理 Stripe 支付
   * @param {Object} order - 订单对象
   * @returns {Promise<Object>} 支付结果
   */
  async processStripe(order) {
    // 调用后端支付 API
    // 注意：实际支付集成需要根据具体支付平台文档实现
    try {
      const { apiPost } = await import('./api.js');
      const result = await apiPost('payment/process', {
        orderId: order.id || order._id,
        paymentMethod: 'stripe'
      });

      if (result.success) {
        return {
          success: true,
          message: result.message || '支付成功',
          paymentId: result.data?.paymentId,
          orderId: order.id || order._id
        };
      }

      return {
        success: false,
        message: result.message || '支付处理失败，请重试'
      };
    } catch (error) {
      console.error('Stripe 支付错误:', error);
      return {
        success: false,
        message: '支付处理失败，请重试'
      };
    }
  }
}

// 导出单例实例
export const paymentService = new PaymentService();
