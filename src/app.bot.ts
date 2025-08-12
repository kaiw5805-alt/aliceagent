import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AppBot {
  getHello(): string {
    return 'Hello World!';
  }
}
