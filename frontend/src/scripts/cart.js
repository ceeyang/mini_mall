/**
 * 购物车管理模块
 * 处理购物车的所有操作：添加、删除、更新、获取
 */

class CartManager {
  constructor() {
    // 从 localStorage 加载购物车数据
    this.cart = this.loadCart();
    this.listeners = [];
  }

  /**
   * 从 localStorage 加载购物车
   * @returns {Array} 购物车商品数组
   */
  loadCart() {
    const stored = localStorage.getItem('miniMallCart');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * 保存购物车到 localStorage
   */
  saveCart() {
    localStorage.setItem('miniMallCart', JSON.stringify(this.cart));
    this.notifyListeners();
  }

  /**
   * 添加商品到购物车
   * @param {Object} product - 商品对象
   * @param {number} quantity - 数量，默认为 1
   */
  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // 如果商品已存在，增加数量
      existingItem.quantity += quantity;
    } else {
      // 如果商品不存在，添加新商品
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }
    
    this.saveCart();
    return this.cart;
  }

  /**
   * 从购物车移除商品
   * @param {number} productId - 商品 ID
   */
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    return this.cart;
  }

  /**
   * 更新商品数量
   * @param {number} productId - 商品 ID
   * @param {number} quantity - 新数量
   */
  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
    return this.cart;
  }

  /**
   * 清空购物车
   */
  clearCart() {
    this.cart = [];
    this.saveCart();
    return this.cart;
  }

  /**
   * 获取购物车所有商品
   * @returns {Array} 购物车商品数组
   */
  getItems() {
    return this.cart;
  }

  /**
   * 获取购物车商品总数
   * @returns {number} 商品总数
   */
  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * 获取购物车总价
   * @returns {number} 总价
   */
  getTotalPrice() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * 检查购物车是否为空
   * @returns {boolean} 是否为空
   */
  isEmpty() {
    return this.cart.length === 0;
  }

  /**
   * 注册监听器，当购物车变化时触发
   * @param {Function} callback - 回调函数
   */
  onCartChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.cart));
  }
}

// 导出单例实例
export const cartManager = new CartManager();
