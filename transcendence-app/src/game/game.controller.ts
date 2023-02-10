import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { CreateGameDto } from './dto/create-game.dto';

@Controller()
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('game')
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

  @Delete('game')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'gameId', type: String })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  async removeGame(gameId: string): Promise<void> {
    return this.gameService.deleteGame(gameId);
  }

  @Get('game')
  @ApiOkResponse({
    description: `Get a game`,
    type: [Game],
  })
  @ApiParam({ name: 'gameId', type: String })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getGame(gameId: string): Promise<Game> {
    const game = await this.gameService.retrieveGameWithId(gameId);
    if (!game) {
      throw new ServiceUnavailableException();
    }
    return game;
  }

  @Get('games')
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

  @Get('games/:userName')
  @ApiOkResponse({
    description: `List all games of a user)`,
    type: [Game],
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getUserGames(
    @Param('userName') userName: string,
    @Query() gamesPaginationQueryDto: PaginationWithSearchQueryDto,
  ): Promise<Game[]> {
    const games = await this.gameService.retrieveUserGames(
      userName,
      gamesPaginationQueryDto,
    );
    if (!games) {
      throw new ServiceUnavailableException();
    }
    return games;
  }
}
