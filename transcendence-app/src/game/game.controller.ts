import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { User as GetUser } from '../user/decorators/user.decorator';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { User } from '../user/infrastructure/db/user.entity';
import { Action } from '../shared/enums/action.enum';
import { GameQueueService } from './game.queue.service';
import { GamePairingStatusDto } from './dto/game-pairing-status.dto';
import { GlobalPoliciesGuard } from '../authorization/guards/global-policies.guard';
import { CheckPolicies } from '../authorization/decorators/policies.decorator';
import { UserLevelWithTimestamp } from './stats/infrastructure/db/user-level-with-timestamp.entity';
import { GameStatsService } from './stats/game-stats.service';
import { GameStats } from './stats/dto/game-stats.dto';
import { GameStatsQueryDto } from './stats/dto/game-stats-query.dto';

@Controller()
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GameController {
  constructor(
    private gameService: GameService,
    private gameQueueService: GameQueueService,
    private readonly statsService: GameStatsService,
  ) {}

  @Get('game/pairing-status')
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

  @Get('game/levels/:username')
  @ApiOkResponse({
    description:
      `Returns the user level history for the given username,` +
      ` (max ${MAX_ENTRIES_PER_PAGE})`,
    type: [UserLevelWithTimestamp],
  })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getUserLevelHistory(
    @Param('username') username: string,
    @Query() gameStatsQueryDto: GameStatsQueryDto,
  ): Promise<UserLevelWithTimestamp[]> {
    const { mode } = gameStatsQueryDto;
    const levels = await this.statsService.getUserLevels(username, mode);
    if (!levels) {
      throw new ServiceUnavailableException();
    }
    return levels;
  }

  @Get('game/stats/:username')
  @ApiOkResponse({
    description: `Returns the game stats for the given username`,
    type: GameStats,
  })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getUserStats(
    @Param('username') username: string,
    @Query() queryGameModeDto: GameStatsQueryDto,
  ): Promise<GameStats> {
    return await this.statsService.getGameStats(
      username,
      queryGameModeDto.mode,
    );
  }

  @Post('game')
  @ApiCreatedResponse({ description: 'Add a game', type: Game })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, CreateGameDto))
  async addGame(@Body() game: CreateGameDto): Promise<Game> {
    const savedGame = await this.gameService.addGame(game);

    if (!savedGame) {
      throw new UnprocessableEntityException();
    }
    return savedGame;
  }

  @Delete('game/:gameId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'gameId', type: String })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiServiceUnavailableResponse({ description: 'Service Unavailable' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseGuards(GlobalPoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Game))
  async removeGame(
    @Param('gameId', ParseUUIDPipe) gameId: string,
  ): Promise<void> {
    return this.gameService.deleteGame(gameId);
  }

  @Get('game/:gameId')
  @ApiOkResponse({
    description: `Get a game`,
    type: [Game],
  })
  @ApiParam({ name: 'gameId', type: String })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiServiceUnavailableResponse({ description: 'Service unavailable' })
  async getGame(@Param('gameId', ParseUUIDPipe) gameId: string): Promise<Game> {
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
