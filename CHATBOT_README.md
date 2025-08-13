# LangChain 对话机器人

这是一个基于 NestJS 和 LangChain 构建的智能对话机器人。

## 功能特性

- 🤖 基于 OpenAI GPT-3.5-turbo 的智能对话
- 💬 支持多轮对话和上下文记忆
- 📝 对话历史管理
- 🔄 支持系统提示词自定义
- 🆔 会话ID管理
- 🧹 对话历史清理

## 安装和配置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here

# 应用配置
PORT=3000
NODE_ENV=development
```

### 3. 启动应用

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run start:prod
```

## API 端点

### 1. 发送消息

**POST** `/chat/send`

请求体：
```json
{
  "message": "你好，请介绍一下你自己",
  "conversationId": "可选，如果不提供会自动生成",
  "systemPrompt": "可选，系统提示词"
}
```

响应：
```json
{
  "message": "你好！我是基于LangChain的AI助手...",
  "conversationId": "conv_1234567890_abc123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 获取对话历史

**GET** `/chat/history/:conversationId`

响应：
```json
{
  "conversationId": "conv_1234567890_abc123",
  "messages": [
    {
      "role": "system",
      "content": "你是一个有用的AI助手",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    {
      "role": "user",
      "content": "你好",
      "timestamp": "2024-01-01T00:00:01.000Z"
    },
    {
      "role": "assistant",
      "content": "你好！有什么可以帮助你的吗？",
      "timestamp": "2024-01-01T00:00:02.000Z"
    }
  ]
}
```

### 3. 清除对话历史

**DELETE** `/chat/history/:conversationId`

响应：
```json
{
  "success": true,
  "message": "对话历史已清除"
}
```

### 4. 获取活跃对话列表

**GET** `/chat/conversations`

响应：
```json
{
  "conversations": ["conv_1234567890_abc123", "conv_1234567890_def456"],
  "count": 2
}
```

### 5. 问候端点

**GET** `/chat/hello`

响应：
```json
{
  "message": "你好！我是基于LangChain的对话机器人，有什么可以帮助您的吗？",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 使用示例

### 使用 curl 测试

```bash
# 发送第一条消息
curl -X POST http://localhost:3000/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好，请介绍一下你自己",
    "systemPrompt": "你是一个友好的AI助手，请用中文回答"
  }'

# 继续对话（使用返回的conversationId）
curl -X POST http://localhost:3000/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你能做什么？",
    "conversationId": "conv_1234567890_abc123"
  }'

# 获取对话历史
curl http://localhost:3000/chat/history/conv_1234567890_abc123
```

### 使用 JavaScript/TypeScript

```typescript
// 发送消息
const response = await fetch('http://localhost:3000/chat/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: '你好，请介绍一下你自己',
    systemPrompt: '你是一个友好的AI助手，请用中文回答'
  })
});

const result = await response.json();
console.log(result.message);
console.log('对话ID:', result.conversationId);

// 继续对话
const nextResponse = await fetch('http://localhost:3000/chat/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: '你能做什么？',
    conversationId: result.conversationId
  })
});
```

## 技术架构

- **框架**: NestJS
- **AI模型**: OpenAI GPT-3.5-turbo
- **对话管理**: LangChain
- **内存管理**: BufferMemory
- **语言**: TypeScript

## 核心组件

### AppBot 类
- 负责与 OpenAI API 交互
- 管理对话历史和会话状态
- 提供消息发送和历史管理功能

### ChatController 类
- 提供 REST API 端点
- 处理 HTTP 请求和响应
- 数据验证和错误处理

## 注意事项

1. **API密钥安全**: 确保将 OpenAI API 密钥安全存储在环境变量中
2. **内存管理**: 当前实现使用内存存储对话历史，重启后数据会丢失
3. **速率限制**: 注意 OpenAI API 的速率限制
4. **错误处理**: 所有 API 调用都包含适当的错误处理

## 扩展功能

可以考虑添加以下功能：

- 数据库持久化对话历史
- 用户认证和授权
- 多用户会话管理
- 文件上传和处理
- 语音转文字功能
- 更丰富的对话模型选择
