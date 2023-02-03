import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { GameGateway } from './game.gateway';
import { AuthorizationModule } from '../authorization/authorization.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Global()
@Module({
  imports: [DbModule, AuthorizationModule],
  providers: [GameGateway, GameService],
  controllers: [GameController],
})
export class GameModule {}
