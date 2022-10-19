import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Global()
@Module({ providers: [ChatGateway] })
export class ChatModule {}
