import React, { useState } from 'react';

const ConversationList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([
    { id: 1, title: '这是一段对话', active: true },
    { id: 2, title: '这是一段对话', active: false },
    { id: 3, title: '这是一段对话', active: false }
  ]);

  const handleConversationClick = (id) => {
    const updatedConversations = conversations.map(conv => ({
      ...conv,
      active: conv.id === id
    }));
    
    setConversations(updatedConversations);
    
    // 通知父组件选择了哪个对话
    const selectedConversation = conversations.find(conv => conv.id === id);
    if (onSelectConversation && selectedConversation) {
      onSelectConversation(selectedConversation);
    }
  };

  return (
    <div>
      <div className="conversation-title">对话</div>
      <div className="conversation-list">
        {conversations.map(conversation => (
          <div 
            key={conversation.id} 
            className={`conversation-item ${conversation.active ? 'active' : ''}`}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <div className="feature-text">{conversation.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList; 