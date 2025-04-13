import React, { useState, useEffect, useRef } from 'react';

const MessageInput = ({ onSendMessage, initialValue = '', isEditing = false, onCancelEdit, disabled = false }) => {
  const [message, setMessage] = useState(initialValue);
  const inputRef = useRef(null);

  // 当初始值改变时更新输入框
  useEffect(() => {
    setMessage(initialValue);
    // 编辑模式下自动聚焦
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialValue, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      // 清空输入框
      setMessage('');
      // 提交后重新聚焦输入框，方便连续输入
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // 记录调试日志
      console.log('消息已发送:', message);
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
      setMessage('');
      console.log('已取消编辑');
    }
  };

  // 监听Enter键提交
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form className="input-container" onSubmit={handleSubmit}>
      <div className={`message-input${disabled ? ' disabled' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder={isEditing ? "编辑消息..." : "给AI Agent发消息"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus
        />
        {isEditing && (
          <button type="button" className="cancel-button" onClick={handleCancel} disabled={disabled}>
            取消
          </button>
        )}
        <button type="submit" className="send-button" disabled={disabled || !message.trim()}>
          <img src="icons/send-icon.svg" alt={isEditing ? "更新" : "发送"} title={isEditing ? "更新" : "发送"} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput; 