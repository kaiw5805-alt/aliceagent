const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testChatbot() {
  console.log('🤖 开始测试 LangChain 对话机器人...\n');

  try {
    // 测试1: 问候端点
    console.log('📝 测试1: 问候端点');
    const helloResponse = await fetch(`${BASE_URL}/chat/hello`);
    const helloData = await helloResponse.json();
    console.log('响应:', helloData.message);
    console.log('');

    // 测试2: 发送第一条消息
    console.log('📝 测试2: 发送第一条消息');
    const firstMessageResponse = await fetch(`${BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '你好，请介绍一下你自己',
        systemPrompt: '你是一个友好的AI助手，请用中文回答，并且要简洁明了'
      })
    });
    
    const firstMessageData = await firstMessageResponse.json();
    console.log('AI回复:', firstMessageData.message);
    console.log('对话ID:', firstMessageData.conversationId);
    console.log('');

    const conversationId = firstMessageData.conversationId;

    // 测试3: 继续对话
    console.log('📝 测试3: 继续对话');
    const secondMessageResponse = await fetch(`${BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '你能帮我做什么？',
        conversationId: conversationId
      })
    });
    
    const secondMessageData = await secondMessageResponse.json();
    console.log('AI回复:', secondMessageData.message);
    console.log('');

    // 测试4: 获取对话历史
    console.log('📝 测试4: 获取对话历史');
    const historyResponse = await fetch(`${BASE_URL}/chat/history/${conversationId}`);
    const historyData = await historyResponse.json();
    console.log('对话历史:');
    historyData.messages.forEach((msg, index) => {
      console.log(`${index + 1}. [${msg.role}] ${msg.content}`);
    });
    console.log('');

    // 测试5: 获取活跃对话列表
    console.log('📝 测试5: 获取活跃对话列表');
    const conversationsResponse = await fetch(`${BASE_URL}/chat/conversations`);
    const conversationsData = await conversationsResponse.json();
    console.log('活跃对话数量:', conversationsData.count);
    console.log('对话ID列表:', conversationsData.conversations);
    console.log('');

    console.log('✅ 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n请确保:');
    console.log('1. 应用正在运行 (npm run start:dev)');
    console.log('2. 已设置 OPENAI_API_KEY 环境变量');
    console.log('3. 端口 3000 可用');
  }
}

// 运行测试
testChatbot();
