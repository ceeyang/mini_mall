/**
 * 请求日志中间件
 * 记录所有 HTTP 请求的详细信息
 */

/**
 * 格式化日期时间
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期时间字符串
 */
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 获取请求的客户端 IP
 * @param {Object} req - Express 请求对象
 * @returns {string} 客户端 IP 地址
 */
function getClientIp(req) {
  return req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
    'unknown';
}

/**
 * 格式化请求体（隐藏敏感信息）
 * @param {Object} body - 请求体对象
 * @returns {Object} 格式化后的请求体
 */
function formatRequestBody(body) {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'creditCard', 'cvv'];
  const formatted = { ...body };

  for (const field of sensitiveFields) {
    if (formatted[field]) {
      formatted[field] = '***';
    }
  }

  // 限制请求体大小（避免日志过大）
  const bodyStr = JSON.stringify(formatted);
  if (bodyStr.length > 500) {
    return { _truncated: true, _length: bodyStr.length, _preview: bodyStr.substring(0, 500) + '...' };
  }

  return formatted;
}

/**
 * 请求日志中间件
 * 记录请求的详细信息
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = formatDateTime(new Date());
  const method = req.method;
  const url = req.originalUrl || req.url;
  const clientIp = getClientIp(req);
  const userAgent = req.get('user-agent') || 'unknown';

  // 记录请求信息
  console.log('\n' + '='.repeat(80));
  console.log(`📥 [${timestamp}] ${method} ${url}`);
  console.log(`   IP: ${clientIp}`);
  console.log(`   User-Agent: ${userAgent}`);

  // 记录查询参数
  if (Object.keys(req.query).length > 0) {
    console.log(`   Query:`, JSON.stringify(req.query));
  }

  // 记录请求体（POST、PUT、PATCH）
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && Object.keys(req.body).length > 0) {
    const formattedBody = formatRequestBody(req.body);
    console.log(`   Body:`, JSON.stringify(formattedBody, null, 2));
  }

  // 记录认证信息（如果有）
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log(`   Auth: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log(`   Auth: ${authHeader.substring(0, 20)}...`);
    }
  }

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusEmoji = statusCode >= 500 ? '❌' : statusCode >= 400 ? '⚠️' : '✅';
    const finishTime = formatDateTime(new Date());

    console.log(`📤 [${finishTime}] ${statusEmoji} ${method} ${url} - ${statusCode} (${duration}ms)`);
    
    // 如果响应有错误，记录响应体
    if (statusCode >= 400) {
      // 注意：这里不能直接读取 res.body，因为响应已经发送
      // 如果需要记录错误响应，可以在路由处理中记录
    }
    
    console.log('='.repeat(80) + '\n');
  });

  next();
};

/**
 * 简化的请求日志中间件（仅记录基本信息）
 * 适用于生产环境
 */
export const simpleLogger = (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const timestamp = formatDateTime(new Date());
    console.log(`[${timestamp}] ${method} ${url} ${statusCode} ${duration}ms`);
  });

  next();
};

export default requestLogger;
