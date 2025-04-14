// Vercel Serverless函数 - API路由
const axios = require('axios');

// 环境变量配置
const API_URL = process.env.API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL_NAME || 'deepseek-r1-250120';

// 简化请求处理以减少内存使用
module.exports = async (req, res) => {
  // 设置CORS头
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

  // 仅处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许', message: '仅支持POST请求' });
  }

  try {
    // 检查API密钥
    if (!API_KEY) {
      return res.status(500).json({
        error: '服务器配置错误',
        message: 'API密钥未配置。请在Vercel项目中设置API_KEY环境变量。'
      });
    }

    // 从请求中提取参数
    const { messages, model = MODEL, temperature, max_tokens, top_p } = req.body;

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: '无效请求',
        message: 'messages字段必须是一个包含消息对象的数组'
      });
    }

    // 构建精简的请求数据对象
    const requestData = {
      model: model || MODEL,
      messages,
      stream: false
    };

    // 仅添加必要的可选参数
    if (temperature !== undefined) requestData.temperature = temperature;
    if (max_tokens !== undefined) requestData.max_tokens = max_tokens;
    if (top_p !== undefined) requestData.top_p = top_p;

    // 创建Axios配置 - 减少超时时间适应Vercel函数限制
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 25000 // 25秒超时
    };

    // 发送请求到API
    const response = await axios.post(API_URL, requestData, config);

    // 将响应发送回客户端
    return res.status(200).json(response.data);
  } catch (error) {
    // 简化错误处理
    let errorMessage = '与Deepseek API通信时发生错误';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.error?.message ||
                     error.response.data?.error ||
                     `API错误(${statusCode})`;
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 504;
      errorMessage = 'API请求超时，请稍后重试';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      statusCode = 502;
      errorMessage = '无法连接到API服务';
    }

    return res.status(statusCode).json({
      error: '处理请求失败',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};