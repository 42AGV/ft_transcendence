import { forwardRef, Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AuthorizationService } from './authorization.service';
import { UserService } from '../../user/user.service';
import { ChatroomMemberService } from '../../chat/chatroom/chatroom-member/chatroom-member.service';
import { UserModule } from '../../user/user.module';
import { ChatModule } from '../../chat/chat.module';
import { DbModule } from '../db/db.module';
import { LocalFileModule } from '../local-file/local-file.module';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  providers: [
    CaslAbilityFactory,
    ChatroomMemberService,
    AuthorizationService,
    UserService,
  ],
  imports: [
    UserModule,
    forwardRef(() => ChatModule),
    DbModule,
    LocalFileModule,
    AvatarModule,
  ],
  exports: [CaslAbilityFactory, AuthorizationService],
})
export class AuthorizationModule {}
