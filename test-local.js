/**
 * 本地代理服务器测试脚本
 * 用于测试本地代理API
 */

const axios = require('axios');

// 本地API配置
const LOCAL_URL = 'http://localhost:3001/api/chat';
const MODEL = 'deepseek-r1-250120';

// 测试消息
const testMessages = [
  {
    role: 'system',
    content: '你是人工智能助手。'
  },
  {
    role: 'user',
    content: '你好，请介绍一下自己'
  }
];

// 请求数据
const requestData = {
  model: MODEL,
  messages: testMessages
};

console.log('开始测试本地代理API...');
console.log('API地址:', LOCAL_URL);
console.log('请求数据:', JSON.stringify(requestData, null, 2));

// 发送请求
axios.post(LOCAL_URL, requestData)
  .then(response => {
    console.log('API请求成功!');
    console.log('状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.choices && response.data.choices.length > 0) {
      console.log('AI回复:', response.data.choices[0].message.content);
    }
  })
  .catch(error => {
    console.error('API请求失败!');
    
    if (error.response) {
      // 服务器响应了但返回了错误状态码
      console.error('错误状态码:', error.response.status);
      console.error('错误响应体:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('未收到响应的请求 - 请确保服务器正在运行');
    } else {
      // 请求设置时出错
      console.error('请求配置错误:', error.message);
    }
  }); 