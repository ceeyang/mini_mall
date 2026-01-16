#!/usr/bin/env node

/**
 * GitHub Webhook 监听服务器
 * 监听 GitHub 的推送事件，自动拉取代码并重新构建部署
 * 
 * 注意：此脚本使用 Node.js 内置模块，无需安装额外依赖
 * 
 * 使用方法：
 * 1. 运行: node github-webhook-server.js
 * 2. 在 GitHub 仓库设置中添加 Webhook:
 *    - URL: http://your-server:3001/webhook
 *    - Content type: application/json
 *    - Secret: 设置一个密钥（需要与脚本中的 SECRET 一致）
 *    - Events: 选择 "Just the push event"
 * 
 * 或使用 PM2 运行:
 *    pm2 start ecosystem-webhook.config.cjs
 */

const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

// 配置
const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key-change-this';
const REPO_PATH = process.env.REPO_PATH || process.cwd();
const BRANCH = process.env.WEBHOOK_BRANCH || 'main'; // 或 'master'

// 日志函数
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
        info: '\x1b[36m',
        success: '\x1b[32m',
        error: '\x1b[31m',
        warning: '\x1b[33m',
        reset: '\x1b[0m'
    };
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

// 验证 GitHub Webhook 签名
function verifySignature(payload, signature) {
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

// 执行命令
function execCommand(command, cwd = REPO_PATH) {
    return new Promise((resolve, reject) => {
        log(`执行命令: ${command}`, 'info');
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                log(`命令执行失败: ${error.message}`, 'error');
                log(`错误输出: ${stderr}`, 'error');
                reject(error);
            } else {
                log(`命令执行成功`, 'success');
                if (stdout) log(`输出: ${stdout}`, 'info');
                resolve(stdout);
            }
        });
    });
}

// 部署流程
async function deploy() {
    try {
        log('🚀 开始自动部署...', 'info');
        
        // 1. 拉取最新代码
        log('📥 拉取最新代码...', 'info');
        await execCommand(`git fetch origin ${BRANCH}`);
        await execCommand(`git reset --hard origin/${BRANCH}`);
        
        // 2. 检查是否有 PM2
        const hasPM2 = await new Promise((resolve) => {
            exec('command -v pm2', (error) => {
                resolve(!error);
            });
        });
        
        if (hasPM2) {
            // 3. 安装依赖
            log('📦 安装后端依赖...', 'info');
            await execCommand('npm install --production', path.join(REPO_PATH, 'backend'));
            
            log('📦 安装前端依赖...', 'info');
            await execCommand('npm install', path.join(REPO_PATH, 'frontend'));
            
            // 4. 重启 PM2 服务
            log('🔄 重启 PM2 服务...', 'info');
            await execCommand('pm2 restart all');
            await execCommand('pm2 save');
            
            log('✅ 部署完成！', 'success');
        } else {
            log('⚠️  PM2 未安装，跳过 PM2 重启步骤', 'warning');
            log('💡 提示: 运行 ./start-pm2.sh 来启动服务', 'info');
        }
        
        return true;
    } catch (error) {
        log(`❌ 部署失败: ${error.message}`, 'error');
        return false;
    }
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    // 只处理 POST 请求到 /webhook
    if (req.method !== 'POST' || req.url !== '/webhook') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }
    
    let body = '';
    
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            // 验证签名
            const signature = req.headers['x-hub-signature-256'];
            if (!signature || !verifySignature(body, signature)) {
                log('❌ Webhook 签名验证失败', 'error');
                res.writeHead(401, { 'Content-Type': 'text/plain' });
                res.end('Unauthorized');
                return;
            }
            
            const payload = JSON.parse(body);
            
            // 只处理 push 事件
            if (payload.ref === `refs/heads/${BRANCH}`) {
                log(`📬 收到 ${BRANCH} 分支的推送事件`, 'info');
                log(`提交信息: ${payload.head_commit?.message || 'N/A'}`, 'info');
                log(`提交者: ${payload.head_commit?.author?.name || 'N/A'}`, 'info');
                
                // 异步执行部署（不阻塞响应）
                deploy().catch((error) => {
                    log(`部署过程出错: ${error.message}`, 'error');
                });
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'success', 
                    message: 'Webhook received, deployment started' 
                }));
            } else {
                log(`⏭️  忽略非 ${BRANCH} 分支的推送`, 'info');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'ignored', 
                    message: `Not watching branch: ${payload.ref}` 
                }));
            }
        } catch (error) {
            log(`❌ 处理 Webhook 时出错: ${error.message}`, 'error');
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
});

// 健康检查端点
server.on('request', (req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            branch: BRANCH,
            repo_path: REPO_PATH
        }));
        return;
    }
});

// 启动服务器
server.listen(PORT, () => {
    log(`🚀 GitHub Webhook 服务器已启动`, 'success');
    log(`📡 监听端口: ${PORT}`, 'info');
    log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`, 'info');
    log(`🌿 监听分支: ${BRANCH}`, 'info');
    log(`📁 仓库路径: ${REPO_PATH}`, 'info');
    log(`🔐 使用密钥: ${SECRET.substring(0, 10)}...`, 'info');
    log('', 'info');
    log('💡 配置 GitHub Webhook:', 'info');
    log(`   URL: http://your-server:${PORT}/webhook`, 'info');
    log(`   Secret: ${SECRET}`, 'info');
    log(`   Content type: application/json`, 'info');
    log(`   Events: Just the push event`, 'info');
});

// 优雅退出
process.on('SIGTERM', () => {
    log('收到 SIGTERM，正在关闭服务器...', 'warning');
    server.close(() => {
        log('服务器已关闭', 'info');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    log('收到 SIGINT，正在关闭服务器...', 'warning');
    server.close(() => {
        log('服务器已关闭', 'info');
        process.exit(0);
    });
});
