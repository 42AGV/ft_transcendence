import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatroomMemberService } from './chatroom/chatroom-member/chatroom-member.service';
import { UserService } from '../user/user.service';
import { AvatarModule } from '../shared/avatar/avatar.module';
import { AuthorizationModule } from '../shared/authorization/authorization.module';
import { CaslAbilityFactory } from '../shared/authorization/casl-ability.factory';
import { AuthorizationService } from '../shared/authorization/authorization.service';
import { IChatroomMemberRepository } from './chatroom/chatroom-member/infrastructure/db/chatroom-member.repository';
import { ChatroomMemberPostgresRepository } from './chatroom/chatroom-member/infrastructure/db/postgres/chatroom-member.postgres.repository';

@Global()
@Module({
  imports: [DbModule, LocalFileModule, AvatarModule, AuthorizationModule],
  providers: [
    ChatGateway,
    ChatService,
    ChatroomMemberService,
    UserService,
    CaslAbilityFactory,
    AuthorizationService,
  ],
  controllers: [ChatController],
  exports: [ChatService, ChatroomMemberService],
})
export class ChatModule {}
