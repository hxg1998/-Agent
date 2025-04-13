import React, { useState, useEffect } from 'react';

const FormattedMessage = ({ content }) => {
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
  
  // 检查内容是否包含推理过程（使用特定标记区分）
  const hasReasoningProcess = content.includes('[推理过程]') && content.includes('[/推理过程]');
  
  // 分离常规内容和推理过程
  let regularContent = content;
  let reasoningProcess = '';
  
  if (hasReasoningProcess) {
    const reasoningStartIdx = content.indexOf('[推理过程]');
    const reasoningEndIdx = content.indexOf('[/推理过程]');
    
    if (reasoningStartIdx !== -1 && reasoningEndIdx !== -1 && reasoningEndIdx > reasoningStartIdx) {
      reasoningProcess = content.substring(reasoningStartIdx + 11, reasoningEndIdx).trim();
      regularContent = content.substring(0, reasoningStartIdx) + content.substring(reasoningEndIdx + 12);
    }
  }

  // 记录调试信息
  useEffect(() => {
    console.log('内容是否包含推理过程:', hasReasoningProcess);
    if (hasReasoningProcess) {
      console.log('推理过程:', reasoningProcess.substring(0, 50) + '...');
      console.log('常规内容:', regularContent.substring(0, 50) + '...');
    } else {
      console.log('完整内容:', content.substring(0, 50) + '...');
    }
  }, [content, hasReasoningProcess, reasoningProcess, regularContent]);
  
  // 切换推理过程的展开/收起状态
  const toggleReasoning = () => {
    setIsReasoningExpanded(!isReasoningExpanded);
  };
  
  // 处理换行
  const formatWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {formatWithEmojis(formatWithBold(line))}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // 处理粗体文字 ** **
  const formatWithBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // 处理emoji标记 🧠 等
  const formatWithEmojis = (textParts) => {
    if (typeof textParts === 'string') {
      const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])\s/g;
      const parts = textParts.split(emojiRegex);
      
      if (parts.length <= 1) return textParts;
      
      const result = [];
      let i = 0;
      
      textParts.replace(emojiRegex, (match, emoji, offset) => {
        // 添加emoji前的文本
        if (offset > i) {
          result.push(<span key={`text-${i}`}>{textParts.substring(i, offset)}</span>);
        }
        
        // 添加emoji
        result.push(<span key={`emoji-${offset}`} className="emoji">{emoji}</span>);
        
        i = offset + emoji.length + 1; // +1 for the space
        return match;
      });
      
      // 添加最后一部分文本
      if (i < textParts.length) {
        result.push(<span key={`text-last`}>{textParts.substring(i)}</span>);
      }
      
      return result;
    }
    
    return textParts;
  };

  return (
    <div className="formatted-message">
      {/* 先显示推理过程，后显示常规内容 */}
      {hasReasoningProcess && (
        <div className={`reasoning-process ${isReasoningExpanded ? 'expanded' : 'collapsed'}`}>
          {formatWithLineBreaks(reasoningProcess)}
          <button className="toggle-reasoning" onClick={toggleReasoning}>
            {isReasoningExpanded ? '收起' : '展开'}
          </button>
        </div>
      )}
      {/* 常规内容容器，确保没有额外的margin */}
      <div className="regular-content">{formatWithLineBreaks(regularContent.trim())}</div>
    </div>
  );
};

export default FormattedMessage; 