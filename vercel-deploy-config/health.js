// Vercel健康检查API端点 - 轻量级实现
module.exports = (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  // 对预检请求的处理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 返回简化的健康状态 - 减少JSON大小
  return res.status(200).json({
    status: 'UP',
    env: process.env.NODE_ENV || 'development',
    ts: new Date().toISOString()
  });
};