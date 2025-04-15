// Vercel Serverless函数 - API路由
const axios = require('axios');

// 环境变量配置
const API_URL = process.env.API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL_NAME || 'deepseek-r1-250120';

// 简化请求处理以减少内存使用
module.exports = async (req, res) => {
  // CORS头已在入口文件中设置

  // 仅处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许', message: '仅支持POST请求' });
  }

  try {
    // 打印请求信息（不包含敏感数据）
    console.log('接收到聊天API请求，时间:', new Date().toISOString());

    // 检查API密钥
    if (!API_KEY) {
      console.error('API密钥未配置错误');
      return res.status(500).json({
        error: '服务器配置错误',
        message: 'API密钥未配置。请在Vercel项目中设置API_KEY环境变量。'
      });
    }

    // 从请求中提取参数
    const { messages, model = MODEL, temperature, max_tokens, top_p } = req.body;

    // 验证请求参数
    if (!messages || !Array.isArray(messages)) {
      console.error('无效请求参数:', { messages: typeof messages });
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

    console.log('使用模型:', requestData.model);
    console.log('消息数量:', messages.length);
    console.log('API URL:', API_URL);

    // 创建Axios配置 - 减少超时时间适应Vercel函数限制
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      timeout: 25000 // 25秒超时
    };

    // 发送请求到API
    const startTime = Date.now();
    console.log('开始调用外部API...');
    const response = await axios.post(API_URL, requestData, config);
    const endTime = Date.now();
    console.log(`外部API响应时间: ${endTime - startTime}ms`);

    // 将响应发送回客户端
    return res.status(200).json(response.data);
  } catch (error) {
    // 详细记录错误信息
    console.error('聊天API错误:', error.message);

    // 简化错误处理
    let errorMessage = '与Deepseek API通信时发生错误';
    let statusCode = 500;
    let errorDetails = null;

    if (error.response) {
      statusCode = error.response.status;
      console.error('API响应错误状态:', statusCode);
      console.error('API响应错误数据:', JSON.stringify(error.response.data || {}));

      errorMessage = error.response.data?.error?.message ||
                     error.response.data?.error ||
                     `API错误(${statusCode})`;
      errorDetails = error.response.data;
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 504;
      errorMessage = 'API请求超时，请稍后重试';
      console.error('API请求超时');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      statusCode = 502;
      errorMessage = '无法连接到API服务';
      console.error('无法连接到API服务:', error.code);
    } else {
      console.error('未分类的API错误:', error.toString());
    }

    return res.status(statusCode).json({
      error: '处理请求失败',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
};