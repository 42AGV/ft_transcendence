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
import { IGamesOngoingRepository } from './infrastructure/db/gamesongoing.repository';
import { IChallengesPendingRepository } from './infrastructure/db/challengespending.repository';

@Global()
@Module({
  imports: [DbModule, AuthorizationModule],
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
  // controllers: [ChatController],
  // exports: [ChatService, ChatroomMemberService],
})
export class GameModule {}
