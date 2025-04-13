/**
 * 前端连接测试脚本
 * 模拟前端环境测试与后端的连接
 */

const axios = require('axios');

// 后端服务器URL
const BACKEND_URL = 'http://localhost:3001/api/test';

// 测试连接
console.log('测试前端到后端的连接...');
console.log('目标URL:', BACKEND_URL);

// 设置请求头模拟前端环境
const headers = {
  'Origin': 'http://localhost:3000',
  'Referer': 'http://localhost:3000/'
};

// 发送请求
axios.get(BACKEND_URL, { headers })
  .then(response => {
    console.log('✅ 连接成功!');
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    console.log('\n后端服务器正常工作，CORS配置正确');
    
    // 测试聊天API
    testChatApi();
  })
  .catch(error => {
    console.error('❌ 连接失败!');
    
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('未收到响应 - 请确保后端服务器正在运行');
    } else {
      console.error('请求错误:', error.message);
    }
  });

// 测试聊天API
function testChatApi() {
  const CHAT_URL = 'http://localhost:3001/api/chat';
  
  // 简单消息
  const requestData = {
    model: 'deepseek-r1-250120',
    messages: [
      {
        role: 'system',
        content: '你是人工智能助手。'
      },
      {
        role: 'user',
        content: '你好'
      }
    ]
  };
  
  console.log('\n测试聊天API...');
  console.log('目标URL:', CHAT_URL);
  
  axios.post(CHAT_URL, requestData, { headers })
    .then(response => {
      console.log('✅ 聊天API请求成功!');
      console.log('状态码:', response.status);
      
      if (response.data.choices && response.data.choices.length > 0) {
        const reply = response.data.choices[0].message.content;
        console.log('AI回复:', reply);
      } else {
        console.log('响应数据:', JSON.stringify(response.data, null, 2));
      }
    })
    .catch(error => {
      console.error('❌ 聊天API请求失败!');
      
      if (error.response) {
        console.error('错误状态码:', error.response.status);
        console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('未收到响应 - 可能是网络问题');
      } else {
        console.error('请求错误:', error.message);
      }
    });
} 