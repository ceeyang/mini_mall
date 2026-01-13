/**
 * 错误处理中间件
 * 统一处理应用中的错误
 */

/**
 * 错误处理中间件
 */
export const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', err);

  // 默认错误信息
  let statusCode = err.statusCode || 500;
  let message = err.message || '服务器内部错误';

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }

  // Mongoose 重复键错误
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} 已存在`;
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的 token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token 已过期';
  }

  // 返回错误响应
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 异步错误处理包装器
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
