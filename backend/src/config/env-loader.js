/**
 * 环境变量加载器
 * 从 backend 目录加载 .env 文件
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 加载环境变量
 * 从 backend/.env 文件加载
 */
export function loadEnv() {
  // 获取 backend 目录
  const backendDir = resolve(__dirname, '../..');
  const envPath = join(backendDir, '.env');
  
  if (existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log(`✅ 已加载环境变量: ${envPath}`);
    } else {
      console.warn(`⚠️  环境变量文件加载失败: ${result.error.message}`);
    }
  } else {
    console.warn('⚠️  未找到环境变量文件 backend/.env，使用默认配置');
    console.warn('   请复制 backend/.env.example 为 backend/.env');
  }
  
  // 始终加载 .env（dotenv 的默认行为，用于覆盖）
  dotenv.config();
}

// 自动加载
loadEnv();
