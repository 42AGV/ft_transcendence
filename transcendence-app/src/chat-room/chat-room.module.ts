import { Global, Module } from '@nestjs/common';
import { ChatRoomGateway } from './chat-room.gateway';

@Global()
@Module({ providers: [ChatRoomGateway] })
export class ChatRoomModule {}
