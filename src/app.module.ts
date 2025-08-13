import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppBot } from './app.bot';
import { ChatController } from './chat.controller';

@Module({
  imports: [],
  controllers: [AppController, ChatController],
  providers: [AppService, AppBot],
})
export class AppModule {}
