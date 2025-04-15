// 健康检查API接口
module.exports = (req, res) => {
  // 检查环境变量是否配置（不暴露具体值）
  const envStatus = {
    API_KEY_CONFIGURED: !!process.env.API_KEY,
    API_URL_CONFIGURED: !!process.env.API_URL,
    MODEL_NAME: process.env.MODEL_NAME || 'deepseek-r1-250120',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };

  // 返回健康状态和环境变量检查
  return res.status(200).json({
    status: 'API 正常运行中',
    serverTime: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    envStatus: envStatus,
    routes: ['/api', '/api/health', '/api/chat']
  });
};