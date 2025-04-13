import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import './styles/global.css';

function App() {
  const [currentConversation, setCurrentConversation] = useState({
    type: 'feature',
    feature: { id: 4, name: '智能穿搭Agent', active: true }
  });

  const handleConversationChange = (change) => {
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