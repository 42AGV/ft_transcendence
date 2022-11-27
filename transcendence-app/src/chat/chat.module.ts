import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { UserService } from '../user/user.service';
import { AvatarModule } from '../shared/avatar/avatar.module';

@Global()
@Module({
  imports: [DbModule, LocalFileModule, AvatarModule],
  providers: [ChatGateway, ChatService, ChatroomMemberService, UserService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
