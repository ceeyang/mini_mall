/**
 * 现代化弹窗组件
 * 提供 alert、confirm 等弹窗功能，替代原生弹窗
 */

/**
 * 显示提示弹窗（替代 alert）
 * @param {string} message - 提示信息
 * @param {string} title - 标题（可选）
 * @param {string} type - 类型：'info', 'success', 'warning', 'error'（默认：'info'）
 * @returns {Promise<void>}
 */
export function showAlert(message, title = '提示', type = 'info') {
  return new Promise((resolve) => {
    const modal = createModal({
      title,
      message,
      type,
      buttons: [
        {
          text: '确定',
          primary: true,
          onClick: () => {
            closeModal(modal);
            resolve();
          }
        }
      ]
    });
    
    showModal(modal);
  });
}

/**
 * 显示确认弹窗（替代 confirm）
 * @param {string} message - 确认信息
 * @param {string} title - 标题（可选，默认：'确认'）
 * @param {string} type - 类型：'info', 'warning', 'error'（默认：'warning'）
 * @returns {Promise<boolean>} 用户点击确认返回 true，取消返回 false
 */
export function showConfirm(message, title = '确认', type = 'warning') {
  return new Promise((resolve) => {
    const modal = createModal({
      title,
      message,
      type,
      buttons: [
        {
          text: '取消',
          primary: false,
          onClick: () => {
            closeModal(modal);
            resolve(false);
          }
        },
        {
          text: '确定',
          primary: true,
          onClick: () => {
            closeModal(modal);
            resolve(true);
          }
        }
      ]
    });
    
    showModal(modal);
  });
}

/**
 * 创建弹窗元素
 * @param {Object} options - 弹窗配置
 * @param {string} options.title - 标题
 * @param {string} options.message - 消息内容
 * @param {string} options.type - 类型
 * @param {Array} options.buttons - 按钮配置数组
 * @returns {HTMLElement} 弹窗元素
 */
function createModal({ title, message, type = 'info', buttons = [] }) {
  // 类型配置
  const typeConfig = {
    info: {
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-gray-900',
      borderColor: 'border-blue-200'
    },
    success: {
      icon: '✓',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-gray-900',
      borderColor: 'border-green-200'
    },
    warning: {
      icon: '⚠',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      titleColor: 'text-gray-900',
      borderColor: 'border-yellow-200'
    },
    error: {
      icon: '✕',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-gray-900',
      borderColor: 'border-red-200'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-[9998] backdrop-blur-sm transition-opacity duration-300';
  overlay.id = 'modal-overlay';

  // 创建弹窗容器
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none';
  modal.id = 'modal-container';

  // 创建弹窗内容
  const modalContent = document.createElement('div');
  modalContent.className = `bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 opacity-0 pointer-events-auto ${config.borderColor} border-2`;
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflowY = 'auto';

  // 创建图标和标题区域
  const header = document.createElement('div');
  header.className = 'flex items-start p-6 pb-4';

  const iconContainer = document.createElement('div');
  iconContainer.className = `flex-shrink-0 w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mr-4`;

  const icon = document.createElement('div');
  icon.className = `text-2xl font-bold ${config.iconColor}`;
  icon.textContent = config.icon;
  iconContainer.appendChild(icon);

  const titleContainer = document.createElement('div');
  titleContainer.className = 'flex-1 pt-1';

  const titleElement = document.createElement('h3');
  titleElement.className = `text-xl font-semibold ${config.titleColor} mb-2`;
  titleElement.textContent = title;

  const messageElement = document.createElement('p');
  messageElement.className = 'text-gray-600 text-sm leading-relaxed';
  messageElement.textContent = message;

  titleContainer.appendChild(titleElement);
  titleContainer.appendChild(messageElement);

  header.appendChild(iconContainer);
  header.appendChild(titleContainer);

  // 创建按钮区域
  const footer = document.createElement('div');
  footer.className = 'px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3';

  buttons.forEach((buttonConfig, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = buttonConfig.primary
      ? 'px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md'
      : 'px-6 py-2.5 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200';
    
    button.textContent = buttonConfig.text;
    button.addEventListener('click', buttonConfig.onClick);
    
    // 添加键盘支持
    if (buttonConfig.primary && index === buttons.length - 1) {
      // 主要按钮支持 Enter 键
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          button.click();
        }
      });
    }
    
    footer.appendChild(button);
  });

  // 组装弹窗
  modalContent.appendChild(header);
  modalContent.appendChild(footer);
  modal.appendChild(modalContent);
  overlay.appendChild(modal);

  // 点击遮罩层关闭（可选）
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      // 对于 confirm，点击遮罩不关闭（需要用户明确选择）
      // 对于 alert，可以点击遮罩关闭
      if (buttons.length === 1) {
        buttons[0].onClick();
      }
    }
  });

  // ESC 键关闭
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      if (buttons.length === 1) {
        buttons[0].onClick();
      } else if (buttons.length > 1) {
        // confirm 弹窗，ESC 相当于取消
        buttons[0].onClick();
      }
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);

  return overlay;
}

/**
 * 显示弹窗
 * @param {HTMLElement} modal - 弹窗元素
 */
function showModal(modal) {
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden'; // 防止背景滚动

  // 触发动画
  requestAnimationFrame(() => {
    const modalContent = modal.querySelector('#modal-container > div');
    const overlay = modal.querySelector('#modal-overlay');
    
    if (modalContent) {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
    }
    
    if (overlay) {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
    }
  });
}

/**
 * 关闭弹窗
 * @param {HTMLElement} modal - 弹窗元素
 */
function closeModal(modal) {
  const modalContent = modal.querySelector('#modal-container > div');
  const overlay = modal.querySelector('#modal-overlay');
  
  if (modalContent) {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
  }
  
  if (overlay) {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
  }

  // 等待动画完成后移除
  setTimeout(() => {
    if (modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
    document.body.style.overflow = ''; // 恢复滚动
  }, 300);
}

/**
 * 显示自定义弹窗
 * @param {Object} options - 弹窗配置
 * @param {string} options.title - 标题
 * @param {string|HTMLElement} options.content - 内容（可以是字符串或 HTML 元素）
 * @param {Array} options.buttons - 按钮配置
 * @param {string} options.type - 类型
 * @returns {Promise<any>} 返回按钮的返回值
 */
export function showCustomModal(options) {
  return new Promise((resolve) => {
    const modal = createModal({
      title: options.title || '提示',
      message: '', // 自定义内容不使用 message
      type: options.type || 'info',
      buttons: (options.buttons || []).map(btn => ({
        ...btn,
        onClick: () => {
          closeModal(modal);
          resolve(btn.returnValue);
        }
      }))
    });

    // 如果有自定义内容，替换消息区域
    if (options.content) {
      const messageElement = modal.querySelector('p.text-gray-600');
      if (messageElement && typeof options.content === 'string') {
        messageElement.innerHTML = options.content;
      } else if (messageElement && options.content instanceof HTMLElement) {
        messageElement.replaceWith(options.content);
      }
    }

    showModal(modal);
  });
}
