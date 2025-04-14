// Vercel Serverless API入口
const health = require('./health');
const chat = require('./chat');

module.exports = (req, res) => {
  // 根据路径分发请求到不同的处理函数
  const path = req.url.split('/').filter(Boolean);

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