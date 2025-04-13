import React, { useState } from 'react';
import FormattedMessage from './FormattedMessage';

const Message = ({ message, onEdit }) => {
  const { id, content, sender, timestamp } = message;
  const isUser = sender === 'user';
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 复制消息内容到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        alert('已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 编辑用户消息
  const handleEdit = () => {
    if (onEdit && isUser) {
      onEdit(id, content);
    }
  };

  // 点赞和点踩
  const handleFeedback = (type) => {
    alert(`感谢您的${type === 'like' ? '点赞' : '反馈'}！`);
    // 这里可以调用后端API记录反馈
  };

  // 去除内容前后的空格
  const cleanContent = isUser ? content : content.trim();

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      {!isUser && (
        <div className="avatar ai-avatar">
          <img src="/ai1.svg" alt="AI头像" />
        </div>
      )}
      
      <div className="message-content">
        <div className="message-bubble">
          {isUser ? cleanContent : <FormattedMessage content={cleanContent} />}
        </div>
        
        <div className="message-footer">
          {isUser && (
            <div className="message-actions">
              <div className="action-button" onClick={handleEdit} title="编辑">
                <img src="icons/edit-icon.svg" alt="编辑" />
              </div>
              <div className="action-button" onClick={handleCopy} title="复制">
                <img src="icons/copy-icon.svg" alt="复制" />
              </div>
            </div>
          )}
          
          {!isUser && (
            <div className="message-actions">
              <div className="action-button" onClick={handleCopy} title="复制">
                <img src="icons/copy-icon.svg" alt="复制" />
              </div>
              <div className="action-button" onClick={() => handleFeedback('like')} title="点赞">
                <img src="icons/thumb-up-icon.svg" alt="点赞" />
              </div>
              <div className="action-button" onClick={() => handleFeedback('dislike')} title="点踩">
                <img src="icons/thumb-down-icon.svg" alt="点踩" />
              </div>
            </div>
          )}
          
          <div className="message-time">{formatTime(timestamp)}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;