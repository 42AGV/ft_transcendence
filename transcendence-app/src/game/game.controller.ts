import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { User as GetUser } from '../user/decorators/user.decorator';
import { Game } from './infrastructure/db/game.entity';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { CaslAbilityFactory } from '../authorization/casl-ability.factory';
import { AuthorizationService } from '../authorization/authorization.service';
import { User } from '../user/infrastructure/db/user.entity';
import { Action } from '../shared/enums/action.enum';
import { GameQueueService } from './game.queue.service';
import { GamePairingStatusDto } from './dto/game-pairing-status.dto';

@Controller()
@UseGuards(TwoFactorAuthenticatedGuard)
@ApiTags('game')
@ApiForbiddenResponse({ description: 'Forbidden' })
export class GameController {
  constructor(
    private gameService: GameService,
    private readonly authorizationService: AuthorizationService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private gameQueueService: GameQueueService,
  ) {}

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

  @Post('game')
  @ApiCreatedResponse({ description: 'Add a game', type: Game })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnprocessableEntityResponse({ description: 'Unprocessable entity' })
  async addGame(
    @GetUser() user: User,
    @Body() game: CreateGameDto,
  ): Promise<Game> {
    const userWithAuthorization =
      await this.authorizationService.getUserWithAuthorizationFromId(user.id);
    const ability = this.caslAbilityFactory.defineAbilitiesFor(
      userWithAuthorization,
    );
    if (ability.cannot(Action.Create, 'all')) {
      throw new ForbiddenException();
    }
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
  async removeGame(@GetUser() user: User, gameId: string): Promise<void> {
    const userWithAuthorization =
      await this.authorizationService.getUserWithAuthorizationFromId(user.id);
    const ability = this.caslAbilityFactory.defineAbilitiesFor(
      userWithAuthorization,
    );
    if (ability.cannot(Action.Delete, 'all')) {
      throw new ForbiddenException();
    }
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
