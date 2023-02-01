import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';

@Controller()
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('game')
  @ApiOkResponse({
    description: `Lists all games (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [Game],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getGames(
    @Query() gamesPaginationQueryDto: PaginationWithSearchQueryDto,
  ): Promise<Game[]> {
    const games = await this.gameService.retrieveGames(gamesPaginationQueryDto);
    if (!games) {
      throw new ServiceUnavailableException();
    }
    return games;
  }

  
}