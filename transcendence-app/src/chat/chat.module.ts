import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatMemberService } from './chatmember.service';

@Global()
@Module({
  imports: [DbModule, LocalFileModule],
  providers: [ChatGateway, ChatService, ChatMemberService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
