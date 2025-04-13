/**
 * 火山引擎Deepseek API测试脚本
 * 用于直接测试API连接和格式
 */

const axios = require('axios');

// 不同的API配置选项进行测试
const API_CONFIGS = [
  // 标准URL
  {
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    model: 'deepseek-r1-250120',
    description: '标准配置'
  },
  // URL路径变体1
  {
    url: 'https://ark.cn-beijing.volces.com/api/chat/completions',
    model: 'deepseek-r1-250120',
    description: '无v3路径'
  },
  // URL路径变体2
  {
    url: 'https://ark.cn-beijing.volces.com/v3/chat/completions',
    model: 'deepseek-r1-250120',
    description: 'api前缀变体'
  },
  // 模型名称变体
  {
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    model: 'deepseek-r1',
    description: '模型名称变体'
  }
];

// API密钥
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error('\x1b[31m%s\x1b[0m', '错误: API_KEY环境变量未设置! 请在.env文件中配置有效的API_KEY');
  process.exit(1);
}

// 测试消息
const testMessages = [
  {
    role: 'system',
    content: '你是人工智能助手。'
  },
  {
    role: 'user',
    content: '你好'
  }
];

// 测试每个配置
async function testConfigs() {
  console.log('开始测试不同API配置...\n');
  
  for (const config of API_CONFIGS) {
    await testApiConfig(config);
    console.log('\n' + '-'.repeat(80) + '\n');
  }
}

// 测试单个配置
async function testApiConfig(config) {
  console.log(`测试配置: ${config.description}`);
  console.log(`API地址: ${config.url}`);
  console.log(`模型名称: ${config.model}`);
  
  // 请求数据
  const requestData = {
    model: config.model,
    messages: testMessages
  };
  
  // 请求头
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };
  
  try {
    console.log('发送请求...');
    const startTime = Date.now();
    const response = await axios.post(config.url, requestData, { headers });
    const endTime = Date.now();
    
    console.log(`✅ 请求成功! (${endTime - startTime}ms)`);
    console.log('状态码:', response.status);
    
    if (response.data.choices && response.data.choices.length > 0) {
      const replyContent = response.data.choices[0].message.content;
      console.log('API回复:', replyContent);
    } else {
      console.log('警告: 响应中没有choices字段');
      console.log('响应数据:', JSON.stringify(response.data, null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('❌ 请求失败!');
    
    if (error.response) {
      console.error(`错误状态码: ${error.response.status}`);
      console.error('错误响应体:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('未收到响应');
    } else {
      console.error('请求错误:', error.message);
    }
    
    return false;
  }
}

// 运行测试
testConfigs(); 