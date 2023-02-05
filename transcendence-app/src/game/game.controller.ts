import {
  Controller,
  Get,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GameQueueService } from './game.queue.service';
import { GamePairingStatusDto } from './dto/game-pairing-status.dto';
import { User as GetUser } from '../user/decorators/user.decorator';
import { User } from '../user/infrastructure/db/user.entity';

@Controller()
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GameController {
  constructor(private gameQueueService: GameQueueService) {}

  @Get('pairing-status')
  @ApiOkResponse({
    description: `Returns the game pairing status of the authenticated user`,
    type: GamePairingStatusDto,
  })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  getPairingStatus(@GetUser() user: User): GamePairingStatusDto {
    const status = this.gameQueueService.getPairingStatus(user.id);
    if (!status) {
      throw new ServiceUnavailableException();
    }
    return status;
  }
}
