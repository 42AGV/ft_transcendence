import { forwardRef, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AuthorizationService } from './authorization.service';
import { ChatroomMemberService } from '../chat/chatroom/chatroom-member/chatroom-member.service';
import { ChatModule } from '../chat/chat.module';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { AvatarModule } from '../shared/avatar/avatar.module';
import { ChatService } from '../chat/chat.service';

@Module({
  providers: [
    CaslAbilityFactory,
    ChatroomMemberService,
    AuthorizationService,
    ChatService,
  ],
  imports: [
    forwardRef(() => ChatModule),
    DbModule,
    LocalFileModule,
    AvatarModule,
  ],
  exports: [CaslAbilityFactory, AuthorizationService],
})
export class AuthorizationModule {}
