import React, { useState } from 'react';
import Logo from './Logo';
import FeatureList from './FeatureList';
import ConversationList from './ConversationList';

const Sidebar = ({ onChangeConversation }) => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    
    // 通知App组件功能已更改
    if (onChangeConversation) {
      onChangeConversation({
        type: 'feature',
        feature: feature
      });
    }
  };
  
  const handleConversationSelect = (conversation) => {
    // 通知App组件对话已更改
    if (onChangeConversation) {
      onChangeConversation({
        type: 'conversation',
        conversation: conversation
      });
    }
  };

  return (
    <div className="sidebar">
      <Logo />
      <FeatureList onSelectFeature={handleFeatureSelect} />
      <ConversationList onSelectConversation={handleConversationSelect} />
    </div>
  );
};

export default Sidebar; 