import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { GameGateway } from './game.gateway';

@Global()
@Module({
  imports: [DbModule],
  providers: [GameGateway],
  // controllers: [ChatController],
  // exports: [ChatService, ChatroomMemberService],
})
export class GameModule {}
