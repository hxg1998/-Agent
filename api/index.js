// Vercel Serverless API入口
const health = require('./health');
const chat = require('./chat');

module.exports = (req, res) => {
  // 设置标准CORS头以允许跨域请求
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 对预检请求的处理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 根据路径分发请求到不同的处理函数
  const path = req.url.split('?')[0].split('/').filter(Boolean);

  console.log('处理API请求:', req.url, '路径分割:', path);

  // 默认为健康检查
  if (!path.length || path[0] === 'health') {
    return health(req, res);
  }

  // 聊天API
  if (path[0] === 'chat') {
    return chat(req, res);
  }

  // 未找到匹配的路由
  return res.status(404).json({
    error: '未找到',
    message: `找不到路径 '${req.url}' 的处理程序`,
    available: ['/api', '/api/health', '/api/chat']
  });
};