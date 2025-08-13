import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { AppBot, ChatMessage } from './app.bot';

export interface SendMessageDto {
  message: string;
  conversationId?: string;
  systemPrompt?: string;
}

export interface ChatHistoryResponse {
  conversationId: string;
  messages: ChatMessage[];
}

@Controller('chat')
export class ChatController {
  constructor(private readonly appBot: AppBot) {}

  /**
   * 发送消息到对话机器人
   */
  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const { message, conversationId, systemPrompt } = sendMessageDto;
    
    if (!message || message.trim() === '') {
      throw new Error('消息内容不能为空');
    }

    return await this.appBot.sendMessage(message, conversationId, systemPrompt);
  }

  /**
   * 获取对话历史
   */
  @Get('history/:conversationId')
  getConversationHistory(@Param('conversationId') conversationId: string): ChatHistoryResponse {
    const messages = this.appBot.getConversationHistory(conversationId);
    return {
      conversationId,
      messages,
    };
  }

  /**
   * 清除对话历史
   */
  @Delete('history/:conversationId')
  clearConversation(@Param('conversationId') conversationId: string) {
    const success = this.appBot.clearConversation(conversationId);
    return {
      success,
      message: success ? '对话历史已清除' : '对话历史不存在',
    };
  }

  /**
   * 获取所有活跃的对话
   */
  @Get('conversations')
  getActiveConversations() {
    const conversations = this.appBot.getActiveConversations();
    return {
      conversations,
      count: conversations.length,
    };
  }

  /**
   * 简单的问候端点
   */
  @Get('hello')
  getHello() {
    return {
      message: this.appBot.getHello(),
      timestamp: new Date(),
    };
  }
}
