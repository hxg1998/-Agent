import React, { useState, useEffect, useRef, useMemo } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { sendMessageToDeepseek, formatMessagesForAPI } from '../services/api';

const Chat = ({ currentConversation }) => {
  // 使用useMemo缓存对话数据，避免不必要的重新渲染
  const conversationsData = useMemo(() => ({
    'feature-4': [
      {
        id: 1,
        content: '今天穿什么衣服好？',
        sender: 'user',
        timestamp: new Date('2023-05-20T20:32:00')
      },
      {
        id: 2,
        content: '根据当前的天气情况和您的个人风格，我建议您今天穿：\n\n🧥 上衣：浅色针织衫或白色T恤\n👖 下装：深蓝色牛仔裤\n👟 鞋子：白色运动鞋或休闲鞋\n\n这套搭配简约时尚，适合日常通勤或休闲场合。如果今天有特殊场合需要出席，可以告诉我具体需求，我会给出更有针对性的建议。',
        sender: 'ai',
        timestamp: new Date('2023-05-20T20:32:30')
      }
    ],
    'feature-5': [
      {
        id: 1,
        content: 'How to improve my English speaking?',
        sender: 'user',
        timestamp: new Date('2023-05-21T10:15:00')
      },
      {
        id: 2,
        content: '要提高英语口语能力，我建议以下方法：\n\n🗣️ **日常练习**：每天至少花30分钟用英语思考或自言自语\n\n👂 **大量听**：收听英语播客、看英语视频和电影（开始时可以使用字幕）\n\n🔄 **找语伴**：寻找可以定期交流的英语学习伙伴\n\n📱 **使用语言学习应用**：如Tandem或HelloTalk这样的APP可以帮你找到母语者交流\n\n🎯 **设定具体目标**：例如"本周学习20个关于商务的词汇并在对话中使用它们"\n\n记住，持续性比完美更重要。每天进步一点点，长期坚持会看到显著效果。',
        sender: 'ai',
        timestamp: new Date('2023-05-21T10:15:30')
      }
    ],
    'feature-6': [
      {
        id: 1,
        content: '我想增肌减脂，有什么推荐的食谱吗？',
        sender: 'user',
        timestamp: new Date('2023-05-22T08:45:00')
      },
      {
        id: 2,
        content: '以下是几个适合增肌减脂的食谱建议：\n\n🍳 **早餐**: 燕麦粥配蛋白质\n- 1/2杯燕麦\n- 1勺蛋白粉\n- 1个全蛋+2个蛋白\n- 少量蓝莓或草莓\n\n🥗 **午餐**: 鸡胸肉沙拉\n- 150g烤鸡胸肉（调味用香草和柠檬）\n- 混合绿叶蔬菜\n- 1/4个牛油果\n- 少量橄榄油和柠檬汁调味\n\n🍲 **晚餐**: 三文鱼配蔬菜\n- 150g烤三文鱼\n- 蒸西兰花和胡萝卜\n- 少量糙米或藜麦\n\n💪 **训练前**: 香蕉+1勺花生酱\n\n🥤 **训练后**: 蛋白奶昔配香蕉\n\n记得保持足够的水分摄入，每天至少2升水。这些食谱富含优质蛋白质和复合碳水化合物，同时控制脂肪摄入，非常适合增肌减脂阶段。',
        sender: 'ai',
        timestamp: new Date('2023-05-22T08:45:40')
      }
    ],
    'conversation-1': [
      {
        id: 1,
        content: '什么是AI时代',
        sender: 'user',
        timestamp: new Date('2023-05-20T20:32:00')
      },
      {
        id: 2,
        // eslint-disable-next-line no-useless-escape
        content: '"AI时代"是指人工智能（Artificial Intelligence，简称AI）技术在社会各领域广泛应用并深刻影响人类生活的历史阶段。这一时代的到来标志着机器不仅能执行简单任务，还能进行学习、推理、决策和创造，逐步与人类的认知能力相媲美，甚至在某些方面超越人类。\n\n🧠 AI时代的核心特征\n智能化的机器与系统\L AI系统能够模拟人类的学习、思考、规划、判断、决策和行动等认知过程，展现出类似人类的推理和认知特征。\n技术的普及与深度渗透\L AI技术已广泛应用于医疗、金融、教育、交通、制造等多个行业，深刻改变了人类的生产和生活方式。\n人机协作的新时代\L AI与人类的协作关系日益密切，AI不仅是工具，更成为人类的伙伴，共同推动社会进步。\n\n🔍 AI时代的技术演进\nAI技术经历了从"信息AI"到"代理AI"的发展过程，逐步向更高级的"物理AI"和"意识AI"迈进。 这些进展使得AI系统在处理复杂任务、适应环境变化和自主决策等方面表现出更强的能力。 \n\n🌐 AI时代的社会影响\n经济转型：AI预计将为全球经济贡献数万亿美元，推动生产力提升和产业结构优化。\n伦理与治理挑战：随着AI技术的发展，如何确保其安全、透明和公平，成为全球关注的焦点。',
        sender: 'ai',
        timestamp: new Date('2023-05-20T20:32:30')
      }
    ]
  }), []);

  // 当前会话的状态管理
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown'); // 'unknown', 'connected', 'error'
  const chatEndRef = useRef(null);

  // 消息历史存储键的前缀
  const CHAT_HISTORY_KEY_PREFIX = 'chat_history_';
  // 消息历史保存的天数
  const HISTORY_EXPIRY_DAYS = 30;

  // 检查后端连接状态
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/test');
        if (response.ok) {
          console.log('后端服务器连接正常');
          setBackendStatus('connected');
        } else {
          console.error('后端服务器返回错误状态:', response.status);
          setBackendStatus('error');
        }
      } catch (error) {
        console.error('后端服务器连接失败:', error);
        setBackendStatus('error');
      }
    };
    
    checkBackendStatus();
  }, []);

  // 加载历史消息
  const loadMessagesFromStorage = (sessionId) => {
    try {
      const key = `${CHAT_HISTORY_KEY_PREFIX}${sessionId}`;
      const storedData = localStorage.getItem(key);
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // 检查是否过期
        if (parsedData.expiry && new Date() > new Date(parsedData.expiry)) {
          // 已过期，清除存储
          localStorage.removeItem(key);
          return conversationsData[sessionId] || [];
        }
        
        // 将字符串时间戳转换回Date对象
        const messagesWithDateObjects = parsedData.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        return messagesWithDateObjects;
      }
    } catch (error) {
      console.error('加载历史消息出错:', error);
    }
    
    return conversationsData[sessionId] || [];
  };

  // 保存消息到本地存储
  const saveMessagesToStorage = (sessionId, messagesToSave) => {
    if (!sessionId) return;
    
    try {
      const key = `${CHAT_HISTORY_KEY_PREFIX}${sessionId}`;
      
      // 设置过期时间（30天后）
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + HISTORY_EXPIRY_DAYS);
      
      const dataToStore = {
        messages: messagesToSave,
        expiry: expiryDate.toISOString()
      };
      
      localStorage.setItem(key, JSON.stringify(dataToStore));
      console.log(`消息已保存到本地存储，过期时间: ${expiryDate.toLocaleString()}`);
    } catch (error) {
      console.error('保存消息到本地存储出错:', error);
    }
  };

  // 清理过期的消息历史
  const cleanupExpiredMessages = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith(CHAT_HISTORY_KEY_PREFIX)) {
          const storedData = localStorage.getItem(key);
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            if (parsedData.expiry && new Date() > new Date(parsedData.expiry)) {
              localStorage.removeItem(key);
              console.log(`已删除过期的消息历史: ${key}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('清理过期消息出错:', error);
    }
  };

  // 当前对话改变时，加载对应的消息和设置当前会话ID
  useEffect(() => {
    if (currentConversation) {
      let key = '';
      
      if (currentConversation.type === 'feature' && currentConversation.feature) {
        key = `feature-${currentConversation.feature.id}`;
      } else if (currentConversation.type === 'conversation' && currentConversation.conversation) {
        key = `conversation-${currentConversation.conversation.id}`;
      }
      
      setCurrentSessionId(key);
      
      if (key) {
        // 从本地存储中加载消息
        const loadedMessages = loadMessagesFromStorage(key);
        setMessages(loadedMessages);
      } else {
        // 如果没有匹配的对话数据，显示空对话
        setMessages([]);
      }
    }
    
    // 清理过期的消息历史
    cleanupExpiredMessages();
  }, [currentConversation, conversationsData]);

  // 将消息保存到state和本地存储
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    
    // 保存到本地存储
    if (currentSessionId) {
      saveMessagesToStorage(currentSessionId, newMessages);
    }
  };

  const handleSendMessage = async (content) => {
    if (editingMessage) {
      // 更新已有消息
      const updatedMessages = messages.map(msg => 
        msg.id === editingMessage.id 
          ? { ...msg, content, timestamp: new Date() } 
          : msg
      );
      updateMessages(updatedMessages);
      setEditingMessage(null);
    } else {
      // 发送新消息
      const newUserMessage = {
        id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
        content,
        sender: 'user',
        timestamp: new Date()
      };
      
      // 立即将用户消息添加到对话
      const updatedMessages = [...messages, newUserMessage];
      updateMessages(updatedMessages);
      console.log('用户消息已添加到对话');
      
      // 调用Deepseek API获取回复
      try {
        setIsLoading(true);
        console.log('开始API调用流程...');
        
        // 准备发送给API的消息记录
        const apiMessages = formatMessagesForAPI(updatedMessages);
        console.log('格式化的API消息:', apiMessages);
        
        // 调用API
        console.log('调用sendMessageToDeepseek...');
        const response = await sendMessageToDeepseek(apiMessages);
        console.log('API调用成功, 收到响应');
        
        // 处理API返回的结果
        if (response && response.choices && response.choices.length > 0) {
          const aiResponse = response.choices[0].message.content;
          console.log('解析AI回复成功，长度:', aiResponse.length);
          
          const newAiMessage = {
            id: updatedMessages.length > 0 ? Math.max(...updatedMessages.map(m => m.id)) + 1 : 1,
            content: aiResponse,
            sender: 'ai',
            timestamp: new Date()
          };
          
          // 将AI回复添加到对话
          const finalMessages = [...updatedMessages, newAiMessage];
          updateMessages(finalMessages);
          console.log('AI消息已添加到对话');
        } else {
          console.error('API响应格式不正确:', response);
          throw new Error('API返回的数据格式不正确');
        }
      } catch (error) {
        console.error('获取AI回复时出错:', error);
        
        // 获取错误消息
        let errorMessage = error.message || '调用API时出错';
        console.error('错误消息:', errorMessage);
        
        // 显示错误消息
        const aiErrorMessage = {
          id: updatedMessages.length > 0 ? Math.max(...updatedMessages.map(m => m.id)) + 1 : 1,
          content: errorMessage,
          sender: 'ai',
          timestamp: new Date()
        };
        
        // 将错误消息添加到对话
        const finalMessages = [...updatedMessages, aiErrorMessage];
        updateMessages(finalMessages);
        console.log('错误消息已添加到对话');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 处理编辑消息
  const handleEditMessage = (id, content) => {
    const message = messages.find(msg => msg.id === id);
    if (message) {
      setEditingMessage(message);
    }
  };

  // 自动滚动到最新消息
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 调试输出
  useEffect(() => {
    console.log('当前对话ID:', currentSessionId);
    console.log('当前消息列表:', messages);
  }, [currentSessionId, messages]);

  return (
    <>
      {backendStatus === 'error' && (
        <div className="backend-error-alert">
          ⚠️ 无法连接到后端服务器，请确保服务器正在运行 (http://localhost:3001)
        </div>
      )}
      
      <div className="conversation">
        {messages.length === 0 ? (
          <div className="empty-conversation">
            <p>发送一条消息开始对话吧</p>
          </div>
        ) : (
          messages.map(message => (
            <Message 
              key={message.id} 
              message={message} 
              onEdit={handleEditMessage}
            />
          ))
        )}
        {isLoading && (
          <div className="message ai-message loading-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        initialValue={editingMessage ? editingMessage.content : ''} 
        isEditing={!!editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
        disabled={isLoading || backendStatus === 'error'}
      />
    </>
  );
};

export default Chat; 