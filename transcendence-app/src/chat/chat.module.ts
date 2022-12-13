import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { UserService } from '../user/user.service';
import { AvatarModule } from '../shared/avatar/avatar.module';
import { CaslModule } from '../shared/casl/casl.module';
import { CaslAbilityFactory } from '../shared/casl/casl-ability.factory';

@Global()
@Module({
  imports: [DbModule, LocalFileModule, AvatarModule, CaslModule],
  providers: [
    ChatGateway,
    ChatService,
    ChatroomMemberService,
    UserService,
    CaslAbilityFactory,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
