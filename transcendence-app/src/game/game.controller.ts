import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { TwoFactorAuthenticatedGuard } from '../shared/guards/two-factor-authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('game')
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Add a game', type: Game })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addGame(@Body() game: CreateGameDto): Promise<Game> {
    const savedGame = await this.gameService.addGame(game);

    if (!savedGame) {
      throw new UnprocessableEntityException();
    }
    return savedGame;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async removeGame(gameId: string): Promise<void> {
    return this.gameService.deleteGame(gameId);
  }

  @Get()
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
