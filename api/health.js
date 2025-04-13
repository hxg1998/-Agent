// Vercel健康检查API端点
module.exports = (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 对预检请求的处理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 返回健康状态
  return res.status(200).json({
    status: 'UP',
    message: 'Deepseek API代理服务器在Vercel上正常运行',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}; 