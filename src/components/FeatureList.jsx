import React, { useState } from 'react';

const FeatureList = ({ onSelectFeature }) => {
  const [features, setFeatures] = useState([
    { id: 1, name: 'AI搜索', active: false, icon: 'search' },
    { id: 2, name: 'AI生图', active: false, icon: 'image' },
    { id: 3, name: '浏览器书签', active: false, icon: 'bookmark' },
    { id: 4, name: '智能穿搭Agent', active: true, icon: 'shirt' },
    { id: 5, name: '英语学习Agent', active: false, icon: 'language' },
    { id: 6, name: '健身食谱Agent', active: false, icon: 'fitness' }
  ]);

  // 创建图标元素的函数
  const getIconElement = (iconName) => {
    // 根据图标名称返回对应的SVG代码
    switch (iconName) {
      case 'search':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.0001 14.0001L11.1001 11.1001" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.66675 6.66667C6.21903 6.66667 6.66675 6.21895 6.66675 5.66667C6.66675 5.11438 6.21903 4.66667 5.66675 4.66667C5.11446 4.66667 4.66675 5.11438 4.66675 5.66667C4.66675 6.21895 5.11446 6.66667 5.66675 6.66667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.9999 10L10.6666 6.66667L3.33325 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'bookmark':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.6666 14L7.99992 10.6667L3.33325 14V3.33333C3.33325 2.97971 3.47373 2.64057 3.72378 2.39052C3.97383 2.14048 4.31296 2 4.66659 2H11.3333C11.6869 2 12.026 2.14048 12.2761 2.39052C12.5261 2.64057 12.6666 2.97971 12.6666 3.33333V14Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'shirt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2L14 4L12.5 8.5L10.5 7.5M6 2L2 4L3.5 8.5L5.5 7.5M10 2C10 2.66667 9.2 4 8 4C6.8 4 6 2.66667 6 2M10 2H6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 7.5V13C5.5 13 6.5 14 8 14C9.5 14 10.5 13 10.5 13V7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'language':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 3.33325H14M8 14.0001V3.33325M3.33337 14.0001H12.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.33337 8.66675C3.33337 8.66675 5.33337 10.6667 8.00004 10.6667C10.6667 10.6667 12.6667 8.66675 12.6667 8.66675" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'fitness':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.33325 10.6666H2.66659C2.31296 10.6666 1.97382 10.5261 1.72378 10.2761C1.47373 10.026 1.33325 9.68688 1.33325 9.33325V6.66659C1.33325 6.31296 1.47373 5.97382 1.72378 5.72378C1.97382 5.47373 2.31296 5.33325 2.66659 5.33325H3.33325M12.6666 10.6666H13.3333C13.6869 10.6666 14.026 10.5261 14.2761 10.2761C14.5261 10.026 14.6666 9.68688 14.6666 9.33325V6.66659C14.6666 6.31296 14.5261 5.97382 14.2761 5.72378C14.026 5.47373 13.6869 5.33325 13.3333 5.33325H12.6666M10.6666 7.33325V8.66659M5.33325 7.33325V8.66659M3.33325 5.33325H12.6666V10.6666H3.33325V5.33325Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return <div className="feature-icon-placeholder"></div>;
    }
  };

  const handleFeatureClick = (id) => {
    const updatedFeatures = features.map(feature => ({
      ...feature,
      active: feature.id === id
    }));
    
    setFeatures(updatedFeatures);
    
    // 通知父组件选中了哪个功能
    const selectedFeature = features.find(feature => feature.id === id);
    if (onSelectFeature && selectedFeature) {
      onSelectFeature(selectedFeature);
    }
  };

  return (
    <div className="feature-list">
      {features.map(feature => (
        <div 
          key={feature.id} 
          className={`feature-item ${feature.active ? 'active' : ''}`}
          onClick={() => handleFeatureClick(feature.id)}
        >
          <div className="feature-icon">
            {getIconElement(feature.icon)}
          </div>
          <div className="feature-text">{feature.name}</div>
        </div>
      ))}
    </div>
  );
};

export default FeatureList; 