# AI对话界面

这是一个基于React的AI对话界面，根据Figma设计稿实现。

## 功能特点

- 响应式设计
- 用户与AI的对话交互
- 侧边栏功能列表
- 历史对话记录
- 消息操作（编辑、复制、点赞、点踩）

## 项目结构

```
ai-chat-interface/
├── public/               # 静态资源
│   ├── icons/            # SVG图标
│   └── index.html        # HTML模板
├── src/                  # 源代码
│   ├── components/       # React组件
│   │   ├── Chat.jsx      # 聊天组件
│   │   ├── ConversationList.jsx # 对话列表
│   │   ├── FeatureList.jsx # 功能列表
│   │   ├── Logo.jsx      # Logo组件
│   │   ├── Message.jsx   # 消息组件
│   │   ├── MessageInput.jsx # 输入框组件
│   │   └── Sidebar.jsx   # 侧边栏组件
│   ├── styles/           # 样式文件
│   │   └── global.css    # 全局样式
│   └── index.js          # 入口文件
└── App.jsx               # 主应用组件
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## 技术栈

- React
- CSS
- SVG

## 更新日志

- 2024-06-27: 添加Vercel Serverless API功能
