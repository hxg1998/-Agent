require('dotenv').config(); // 加载.env文件中的环境变量
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// 从环境变量获取配置
const API_URL = process.env.API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_KEY = process.env.API_KEY;
const MODEL = process.env.MODEL_NAME || 'deepseek-r1-250120';
const PORT = process.env.PORT || 3001;

// 验证API密钥是否存在
if (!API_KEY) {
  console.error('\x1b[31m%s\x1b[0m', '错误: API_KEY环境变量未设置! 请在.env文件中配置有效的API_KEY');
  process.exit(1); // 终止程序，防止在没有API密钥的情况下启动
}

// CORS配置
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// 中间件
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'build')));

// 更详细的请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'OPTIONS') {
    console.log('收到预检请求');
  }
  next();
});

// API代理路由
app.post('/api/chat', async (req, res) => {
  try {
    // 记录传入请求的来源和重要头信息
    console.log(`收到API请求 [${new Date().toISOString()}]`);
    console.log('请求来源:', req.ip);
    console.log('请求头信息:', {
      'content-type': req.headers['content-type'],
      'accept': req.headers['accept'],
      'user-agent': req.headers['user-agent']
    });
    
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
    
    // 记录请求详情
    console.log(`转发请求到Deepseek API: ${API_URL}`);
    console.log(`模型: ${model}`);
    console.log(`消息数量: ${messages.length}`);
    
    // 记录可选参数值（如果提供）
    if (temperature) console.log(`温度: ${temperature}`);
    if (max_tokens) console.log(`最大tokens: ${max_tokens}`);
    if (top_p) console.log(`top_p: ${top_p}`);
    if (presence_penalty) console.log(`presence_penalty: ${presence_penalty}`);
    if (frequency_penalty) console.log(`frequency_penalty: ${frequency_penalty}`);
    
    // 设置模型值，如果客户端未提供则使用默认值
    const useModel = model || MODEL;
    
    // 检查客户端提供的模型是否与配置的不同，如果不同则记录
    if (model && model !== MODEL) {
      console.warn(`警告: 客户端请求模型 '${model}' 与服务器配置模型 '${MODEL}' 不符`);
    }
    
    // 构建请求数据对象
    const requestData = {
      model: useModel,
      messages,
      stream: false // 显式禁用流式响应，确保返回完整回复
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
      timeout: 180000 // 增加超时时间到180秒，允许更长的回复时间
    };
    
    console.log('发送请求...');
    const startTime = Date.now();
    
    // 发送请求到Deepseek API
    const response = await axios.post(API_URL, requestData, config);
    
    const endTime = Date.now();
    console.log(`请求完成，耗时: ${endTime - startTime}ms`);
    console.log(`响应状态: ${response.status}`);
    
    // 将响应发送回客户端
    res.json(response.data);
  } catch (error) {
    console.error('服务器错误:', error.message);
    
    let errorMessage = '与Deepseek API通信时发生错误';
    let statusCode = 500;
    
    if (error.response) {
      // 从API响应中提取错误信息
      statusCode = error.response.status;
      console.error(`API错误状态码: ${statusCode}`);
      
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
    
    console.error(`返回错误响应: ${statusCode} - ${errorMessage}`);
    
    // 返回格式化的错误响应
    res.status(statusCode).json({
      error: '处理请求失败',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Deepseek API代理服务器正常运行',
    timestamp: new Date().toISOString()
  });
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '代理服务器正常工作',
    config: {
      url: API_URL,
      model: MODEL
    }
  });
});

// 所有其他请求返回React应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log('\x1b[32m%s\x1b[0m', `
========================================
    Deepseek API代理服务器已启动
    端口: ${PORT}
    API地址: ${API_URL}
    模型: ${MODEL}
    API密钥: ${'*'.repeat(8)}${API_KEY.substring(API_KEY.length - 4)}
========================================
  `);
  console.log(`API代理路径: http://localhost:${PORT}/api/chat`);
  console.log(`使用火山引擎API: ${API_URL}`);
  console.log(`使用模型: ${MODEL}`);
  console.log('已允许的前端源:', corsOptions.origin.join(', '));
}); 