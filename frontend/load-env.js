/**
 * 环境变量加载脚本
 * 仅在开发环境从 .env 文件加载环境变量
 * 生产环境不加载 .env 文件，使用硬编码配置
 * 
 * 此脚本需要在 HTML 中通过 <script> 标签引入
 */

/**
 * 判断是否为开发环境
 * @returns {boolean} 是否为开发环境
 */
function isDevelopment() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const hostname = window.location.hostname;
  // 开发环境：localhost 或 127.0.0.1
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * 解析 .env 文件内容
 * @param {string} content - .env 文件内容
 * @returns {Object} 解析后的环境变量对象
 */
function parseEnvFile(content) {
  const env = {};
  const lines = content.split('\n');
  
  for (const line of lines) {
    // 跳过空行和注释
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    
    // 解析 KEY=VALUE 格式
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // 移除引号
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      env[key] = value;
    }
  }
  
  return env;
}

/**
 * 加载环境变量（仅开发环境）
 */
async function loadEnv() {
  // 生产环境：不加载 .env 文件
  if (!isDevelopment()) {
    console.log('[Env] 生产环境，跳过 .env 文件加载，使用硬编码配置');
    return;
  }
  
  // 开发环境：从 .env 文件加载
  if (typeof window !== 'undefined') {
    window.ENV = window.ENV || {};
    
    // 尝试从多个位置加载 .env 文件（优先级顺序）
    // 使用绝对路径，从项目根目录开始查找
    const envPaths = [
      '/.env',               // 根目录的 .env
      '/.env.example'        // 如果 .env 不存在，使用示例文件
    ];
    
    let loaded = false;
    for (const path of envPaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const content = await response.text();
          const env = parseEnvFile(content);
          // 合并到 window.ENV
          Object.assign(window.ENV, env);
          console.log(`[Env] ✅ 已加载环境变量: ${path}`);
          loaded = true;
          break;
        }
      } catch (error) {
        // 忽略文件不存在的错误
      }
    }
    
    if (!loaded) {
      console.warn('[Env] ⚠️  未找到 .env 文件，将使用默认配置');
    }
  }
}

// 自动加载（仅在开发环境）
loadEnv();
