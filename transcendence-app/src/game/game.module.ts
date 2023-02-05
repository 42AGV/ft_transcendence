import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { GameGateway } from './game.gateway';
import { AuthorizationModule } from '../authorization/authorization.module';
import { GameQueueGateway } from './game.queue.gateway';
import { GameQueueService } from './game.queue.service';
import {
  ChallengesPending,
  GamesOngoing,
} from './infrastructure/db/memoryModels';
import { IGamesOngoingRepository } from './infrastructure/db/games-ongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challenges-pending.repository';
import { GameController } from './game.controller';
import { SocketModule } from '../socket/socket.module';

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
    {
      provide: IGamesOngoingRepository,
      useClass: GamesOngoing,
    },
  ],
  controllers: [GameController],
  // exports: [ChatService, ChatroomMemberService],
})
export class GameModule {}
