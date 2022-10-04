import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Global()
@Module({ providers: [ChatGateway, ChatService], exports: [ChatService] })
export class ChatModule {}
