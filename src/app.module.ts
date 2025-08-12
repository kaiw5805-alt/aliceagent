import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppBot } from './app.bot';
import { Chat } from './chat';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppBot, Chat],
})
export class AppModule {}
