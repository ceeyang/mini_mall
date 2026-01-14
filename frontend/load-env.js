/**
 * 环境变量加载脚本
 * 从 frontend/.env 文件加载环境变量并注入到页面
 * 此脚本需要在 HTML 中通过 <script> 标签引入
 */

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
 * 加载环境变量
 */
async function loadEnv() {
  // 创建 ENV 对象（如果不存在）
  if (typeof window !== 'undefined') {
    window.ENV = window.ENV || {};
    
    // 尝试从多个位置加载 .env 文件（优先级顺序）
    // 使用绝对路径，从项目根目录开始查找
    const envPaths = [
      '/.env',               // 根目录的 .env（兼容性）
      '/.env.example'
    ];
    
    for (const path of envPaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const content = await response.text();
          const env = parseEnvFile(content);
          // 合并到 window.ENV
          Object.assign(window.ENV, env);
          console.log(`✅ 已加载环境变量: ${path}`);
          break;
        }
      } catch (error) {
        // 忽略文件不存在的错误
      }
    }
  }
}

// 自动加载
loadEnv();
