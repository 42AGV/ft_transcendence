import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { GameGateway } from './game.gateway';
import { AuthorizationModule } from '../authorization/authorization.module';
import { GameQueueGateway } from './game.queue.gateway';
import { GameQueueService } from './game.queue.service';
import { ChallengesPending } from './infrastructure/db/memoryModels';
import { IChallengesPendingRepository } from './infrastructure/db/challenges-pending.repository';
import { GameController } from './game.controller';
import { SocketModule } from '../socket/socket.module';
import { GameService } from './game.service';

@Global()
@Module({
  imports: [DbModule, AuthorizationModule, SocketModule],
  providers: [
    GameGateway,
    GameQueueGateway,
    GameQueueService,
    {
      provide: IChallengesPendingRepository,
      useClass: ChallengesPending,
    },
    GameService,
  ],
  controllers: [GameController],
  // exports: [ChatService, ChatroomMemberService],
})
export class GameModule {}
