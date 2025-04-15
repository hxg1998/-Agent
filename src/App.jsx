import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { checkServerConfig } from './services/api';
import './styles/global.css';

function App() {
  const [currentConversation, setCurrentConversation] = useState({
    type: 'feature',
    feature: { id: 4, name: '智能穿搭Agent', active: true },
  });

  // 应用启动时检查服务器配置
  useEffect(() => {
    const verifyServerConfig = async () => {
      try {
        console.log('应用启动，检查服务器配置...');
        const configStatus = await checkServerConfig();
        console.log('服务器配置状态:', configStatus);

        // 如果API密钥未配置，显示友好提示
        if (configStatus.envStatus && !configStatus.envStatus.API_KEY_CONFIGURED) {
          alert('警告: 服务器未正确配置API密钥，功能将无法使用。请联系管理员配置环境变量。');
        }
      } catch (error) {
        console.error('服务器配置检查失败:', error);
      }
    };

    verifyServerConfig();
  }, []);

  const handleConversationChange = change => {
    setCurrentConversation(change);
    // 这里可以根据change.type和change.feature/change.conversation
    // 来加载不同的对话内容或切换功能
    console.log('切换到:', change);
  };

  return (
    <div className="app-container">
      <Sidebar onChangeConversation={handleConversationChange} />
      <div className="main-content">
        <Chat currentConversation={currentConversation} />
      </div>
    </div>
  );
}

export default App;
