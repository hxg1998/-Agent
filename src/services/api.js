import axios from 'axios';

// 从环境变量加载配置（生产环境）或默认值（开发环境）
const API_URL = process.env.API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_KEY = process.env.API_KEY; // 不提供默认值以强制配置
const MODEL = process.env.MODEL_NAME || 'deepseek-r1-250120';

// 验证API密钥是否已配置
if (!API_KEY && process.env.NODE_ENV === 'production') {
  console.error('错误: API_KEY环境变量未设置。请在.env文件中配置API_KEY。');
  // 在生产环境中，如果未设置API密钥则抛出错误
  throw new Error('API密钥未配置');
}

// 本地代理API - 使用完整URL，包含主机和端口
const LOCAL_PROXY_URL = 'http://localhost:3001/api/chat';

// 创建axios实例，添加超时设置和重试
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 180000 // 增加超时时间到180秒，以便接收更复杂的回复
});

/**
 * 调用deepseek-r1 API发送消息并获取回复
 * @param {Array} messages - 消息历史数组，包含系统消息和用户消息
 * @returns {Promise} Promise对象，解析为API响应
 */
export const sendMessageToDeepseek = async (messages) => {
  try {
    // 系统消息精确模拟deepseek官网风格和质量
    const systemMessage = {
      role: 'system',
      content: `你是 Deepseek-R1-250120，一个专业的大型语言模型，由 Deepseek 公司开发。请在回答问题时遵循以下准则：

回答风格与特点：
1. 专业权威：提供基于事实和最新研究的深入见解
2. 逻辑清晰：思路连贯，论证严密，层次分明
3. 内容全面：考虑多种观点和解决方案，涵盖关键细节
4. 语言精炼：表达流畅自然，术语准确，语言优雅

每次回答请包含两个部分：
[推理过程]
在这部分，展示你的专业分析思考过程：
- 问题拆解：识别核心问题和隐含需求
- 知识检索：调用相关领域的专业知识
- 多维分析：从不同角度全面思考问题
- 逻辑推理：采用严谨的推理过程得出结论
- 潜在限制：指出推理中的假设或限制
[/推理过程]

随后提供高质量的正式回答，内容应：
- 组织有序：使用适当的标题、分段和列表
- 深入浅出：复杂概念用简明语言解释
- 图文并茂：适当使用类比和生动描述
- 务实可行：提供具体、可操作的建议
- 前沿视角：体现对领域最新发展的了解

特别注意：
- 中文回答时，使用流畅自然的中文表达，避免生硬翻译
- 涉及代码时，提供完整、可执行、注释充分的代码
- 学术讨论时，引用相关理论和研究支持观点
- 不确定内容清晰标明，避免虚构信息

请在每个回答中充分发挥你作为顶尖语言模型的能力，提供超出用户预期的价值。`
    };

    // 更新消息数组，确保系统消息在最前面
    let updatedMessages = messages.filter(msg => msg.role !== 'system');
    updatedMessages.unshift(systemMessage);

    // 构建请求数据 - 参数调优以匹配deepseek官网效果
    const requestData = {
      model: MODEL,
      messages: updatedMessages,
      temperature: 0.4, // 降低温度，提高回答一致性和可靠性
      max_tokens: 6000, // 增加令牌上限，允许更全面的回答
      top_p: 0.95, // 提高top_p，保留更多高质量选项
      presence_penalty: 0.05, // 轻微鼓励话题多样性
      frequency_penalty: 0.2 // 减少重复短语和句子
    };

    console.log('准备发送API请求...');
    console.log('使用模型:', MODEL);
    console.log('完整请求URL:', LOCAL_PROXY_URL);
    
    // 添加时间戳记录
    const startTime = Date.now();
    const response = await apiClient.post(LOCAL_PROXY_URL, requestData);
    const endTime = Date.now();
    
    console.log(`API响应时间: ${endTime - startTime}ms`);
    console.log('API响应状态:', response.status);
    
    // 检查响应
    if (!response.data) {
      throw new Error('API返回了空响应');
    }
    
    // 记录接收到的数据
    if (response.data.choices && response.data.choices.length > 0) {
      const replyContent = response.data.choices[0].message.content;
      console.log('接收到AI回复,长度:', replyContent.length);
      console.log('回复预览:', replyContent.substring(0, 150) + (replyContent.length > 150 ? '...' : ''));
    } else {
      console.warn('API响应中没有找到choices字段:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('调用Deepseek API错误详情:', error);
    
    let errorMessage = '调用API时出错';
    
    if (error.response) {
      // 服务器响应了，但返回错误状态码
      console.error('错误响应状态:', error.response.status);
      
      if (error.response.data && error.response.data.error) {
        errorMessage = typeof error.response.data.error === 'string' 
          ? error.response.data.error 
          : JSON.stringify(error.response.data.error);
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data && error.response.data.details) {
        errorMessage = JSON.stringify(error.response.data.details);
      } else {
        errorMessage = `API错误(${error.response.status}): 服务器返回了错误`;
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('未收到响应的请求');
      errorMessage = '网络问题：未能连接到后端服务器，请确保服务器正在运行并且端口正确';
    } else {
      // 请求设置时出错
      console.error('请求配置错误:', error.message);
      errorMessage = `请求错误: ${error.message}`;
    }
    
    // 记录最终的错误消息
    console.error('将向用户显示的错误:', errorMessage);
    
    // 提供更友好的错误消息
    if (errorMessage.includes('404')) {
      errorMessage = '服务器无法找到请求的API。可能是API地址错误或服务不可用。请检查服务器设置。';
    } else if (errorMessage.includes('Network Error')) {
      errorMessage = '无法连接到后端服务器。请确保后端服务器(http://localhost:3001)正在运行。';
    }
    
    // 自定义error对象
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.isApiError = true;
    
    throw enhancedError;
  }
};

/**
 * 将应用内消息格式转换为API需要的格式
 * @param {Array} appMessages - 应用内的消息数组
 * @returns {Array} 格式化后的消息数组，适用于API
 */
export const formatMessagesForAPI = (appMessages) => {
  return appMessages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}; 