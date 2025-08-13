import { Injectable } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  conversationId?: string;
  timestamp: Date;
}

@Injectable()
export class AppBot {
  private llm: ChatDeepSeek;
  private memory: BufferMemory;
  private conversationChain: ConversationChain;
  private conversations: Map<string, ChatMessage[]> = new Map();

  constructor() {
    // 初始化OpenAI聊天模型
    this.llm = new ChatDeepSeek({
      model: 'deepseek-chat',
      apiKey: process.env.DEEPSEEK_API_KEY,
      temperature: 0.7,
      maxTokens: 1000,
      streaming: false,
    });

    // 初始化内存管理
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history',
    });

    // 初始化对话链
    this.conversationChain = new ConversationChain({
      llm: this.llm,
      memory: this.memory,
    });
  }

  /**
   * 发送消息并获取回复
   */
  async sendMessage(
    message: string,
    conversationId?: string,
    systemPrompt?: string
  ): Promise<ChatResponse> {
    try {
      // 如果没有提供conversationId，生成一个新的
      if (!conversationId) {
        conversationId = this.generateConversationId();
      }

      // 获取或创建对话历史
      let conversation = this.conversations.get(conversationId) || [];
      
      // 添加系统提示（如果提供）
      if (systemPrompt && conversation.length === 0) {
        conversation.push({
          role: 'system',
          content: systemPrompt,
          timestamp: new Date(),
        });
      }

      // 添加用户消息
      conversation.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // 准备消息历史
      const messages = conversation.map(msg => {
        switch (msg.role) {
          case 'user':
            return new HumanMessage(msg.content);
          case 'assistant':
            return new AIMessage(msg.content);
          case 'system':
            return new SystemMessage(msg.content);
          default:
            return new HumanMessage(msg.content);
        }
      });

      // 调用LLM获取回复
      const response = await this.llm.invoke(messages);
      const aiResponse = response.content as string;

      // 添加AI回复到对话历史
      conversation.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      });

      // 更新对话历史
      this.conversations.set(conversationId, conversation);

      return {
        message: aiResponse,
        conversationId,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('发送消息时出错:', error);
      throw new Error(`对话机器人错误: ${error.message}`);
    }
  }

  /**
   * 获取对话历史
   */
  getConversationHistory(conversationId: string): ChatMessage[] {
    return this.conversations.get(conversationId) || [];
  }

  /**
   * 清除对话历史
   */
  clearConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  /**
   * 获取所有活跃的对话ID
   */
  getActiveConversations(): string[] {
    return Array.from(this.conversations.keys());
  }

  /**
   * 生成唯一的对话ID
   */
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 简单的问候方法
   */
  getHello(): string {
    return '你好！我是基于LangChain的对话机器人，有什么可以帮助您的吗？';
  }
}
