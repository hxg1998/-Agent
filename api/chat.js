// Vercel Serverless函数 - API路由
const axios = require('axios');

// 环境变量配置
const API_URL = process.env.API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL_NAME || 'deepseek-r1-250120';

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
      console.error('错误: API_KEY环境变量未设置');
      return res.status(500).json({
        error: '服务器配置错误',
        message: 'API密钥未配置。请在Vercel项目中设置API_KEY环境变量。'
      });
    }

    // 从请求中提取参数
    const { 
      messages, 
      model = MODEL, 
      temperature,
      max_tokens,
      top_p,
      presence_penalty,
      frequency_penalty
    } = req.body;
    
    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: '无效请求',
        message: 'messages字段必须是一个包含消息对象的数组'
      });
    }
    
    // 构建请求数据对象
    const requestData = {
      model: model || MODEL,
      messages,
      stream: false
    };
    
    // 添加可选参数（如果提供）
    if (temperature !== undefined) requestData.temperature = temperature;
    if (max_tokens !== undefined) requestData.max_tokens = max_tokens;
    if (top_p !== undefined) requestData.top_p = top_p;
    if (presence_penalty !== undefined) requestData.presence_penalty = presence_penalty;
    if (frequency_penalty !== undefined) requestData.frequency_penalty = frequency_penalty;
    
    // 创建Axios配置
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 180000 // 增加超时时间到180秒
    };
    
    // 发送请求到Deepseek API
    const response = await axios.post(API_URL, requestData, config);
    
    // 将响应发送回客户端
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('服务器错误:', error.message);
    
    let errorMessage = '与Deepseek API通信时发生错误';
    let statusCode = 500;
    
    if (error.response) {
      // 从API响应中提取错误信息
      statusCode = error.response.status;
      
      if (error.response.data && error.response.data.error) {
        errorMessage = `API错误: ${JSON.stringify(error.response.data.error)}`;
      } else if (error.response.data) {
        errorMessage = `API错误: ${JSON.stringify(error.response.data)}`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'API请求超时。请尝试减少消息长度或增加超时时间。';
      statusCode = 504; // Gateway Timeout
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = `无法连接到Deepseek API (${error.code})。请检查API URL和网络连接。`;
      statusCode = 502; // Bad Gateway
    }
    
    // 返回格式化的错误响应
    return res.status(statusCode).json({
      error: '处理请求失败',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}; 