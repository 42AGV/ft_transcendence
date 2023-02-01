import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { GameGateway } from './game.gateway';
import { AuthorizationModule } from '../authorization/authorization.module';
import { GameQueueGateway } from './game.queue.gateway';
import { GameQueueService } from './game.queue.service';

@Global()
@Module({
  imports: [DbModule, AuthorizationModule],
  providers: [GameGateway, GameQueueGateway, GameQueueService],
  // controllers: [ChatController],
  // exports: [ChatService, ChatroomMemberService],
})
export class GameModule {}
