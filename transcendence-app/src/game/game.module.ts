import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { GameGateway } from './game.gateway';
import { AuthorizationModule } from '../authorization/authorization.module';

@Global()
@Module({
  imports: [DbModule, AuthorizationModule],
  providers: [GameGateway],
  // controllers: [ChatController],
  // exports: [ChatService, ChatroomMemberService],
})
export class GameModule {}
