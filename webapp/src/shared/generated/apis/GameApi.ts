/* tslint:disable */
/* eslint-disable */
/**
 * transcendence-app
 * The transcendence-app API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  CreateGameDto,
  Game,
  GamePairingStatusDto,
  GameStats,
  GameWithUsers,
  UserLevelWithTimestamp,
} from '../models';
import {
    CreateGameDtoFromJSON,
    CreateGameDtoToJSON,
    GameFromJSON,
    GameToJSON,
    GamePairingStatusDtoFromJSON,
    GamePairingStatusDtoToJSON,
    GameStatsFromJSON,
    GameStatsToJSON,
    GameWithUsersFromJSON,
    GameWithUsersToJSON,
    UserLevelWithTimestampFromJSON,
    UserLevelWithTimestampToJSON,
} from '../models';

export interface GameControllerAddGameRequest {
    createGameDto: CreateGameDto;
}

export interface GameControllerGetGameRequest {
    gameId: string;
}

export interface GameControllerGetGamesRequest {
    limit?: number;
    sort?: GameControllerGetGamesSortEnum;
    search?: string;
    offset?: number;
}

export interface GameControllerGetUserGamesRequest {
    userName: string;
    limit?: number;
    sort?: GameControllerGetUserGamesSortEnum;
    search?: string;
    offset?: number;
}

export interface GameControllerGetUserGamesWithUsersRequest {
    userName: string;
    limit?: number;
    sort?: GameControllerGetUserGamesWithUsersSortEnum;
    search?: string;
    offset?: number;
}

export interface GameControllerGetUserLevelHistoryRequest {
    username: string;
    mode?: GameControllerGetUserLevelHistoryModeEnum;
}

export interface GameControllerGetUserStatsRequest {
    username: string;
    mode?: GameControllerGetUserStatsModeEnum;
}

export interface GameControllerRemoveGameRequest {
    gameId: string;
}

/**
 * 
 */
export class GameApi extends runtime.BaseAPI {

    /**
     */
    async gameControllerAddGameRaw(requestParameters: GameControllerAddGameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Game>> {
        if (requestParameters.createGameDto === null || requestParameters.createGameDto === undefined) {
            throw new runtime.RequiredError('createGameDto','Required parameter requestParameters.createGameDto was null or undefined when calling gameControllerAddGame.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/game`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CreateGameDtoToJSON(requestParameters.createGameDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GameFromJSON(jsonValue));
    }

    /**
     */
    async gameControllerAddGame(requestParameters: GameControllerAddGameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Game> {
        const response = await this.gameControllerAddGameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetGameRaw(requestParameters: GameControllerGetGameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Game>>> {
        if (requestParameters.gameId === null || requestParameters.gameId === undefined) {
            throw new runtime.RequiredError('gameId','Required parameter requestParameters.gameId was null or undefined when calling gameControllerGetGame.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/game/{gameId}`.replace(`{${"gameId"}}`, encodeURIComponent(String(requestParameters.gameId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GameFromJSON));
    }

    /**
     */
    async gameControllerGetGame(requestParameters: GameControllerGetGameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Game>> {
        const response = await this.gameControllerGetGameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetGamesRaw(requestParameters: GameControllerGetGamesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Game>>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['sort'] = requestParameters.sort;
        }

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/games`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GameFromJSON));
    }

    /**
     */
    async gameControllerGetGames(requestParameters: GameControllerGetGamesRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Game>> {
        const response = await this.gameControllerGetGamesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetPairingStatusRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GamePairingStatusDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/game/pairing-status`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GamePairingStatusDtoFromJSON(jsonValue));
    }

    /**
     */
    async gameControllerGetPairingStatus(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GamePairingStatusDto> {
        const response = await this.gameControllerGetPairingStatusRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetUserGamesRaw(requestParameters: GameControllerGetUserGamesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Game>>> {
        if (requestParameters.userName === null || requestParameters.userName === undefined) {
            throw new runtime.RequiredError('userName','Required parameter requestParameters.userName was null or undefined when calling gameControllerGetUserGames.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['sort'] = requestParameters.sort;
        }

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/games/{userName}`.replace(`{${"userName"}}`, encodeURIComponent(String(requestParameters.userName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GameFromJSON));
    }

    /**
     */
    async gameControllerGetUserGames(requestParameters: GameControllerGetUserGamesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Game>> {
        const response = await this.gameControllerGetUserGamesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetUserGamesWithUsersRaw(requestParameters: GameControllerGetUserGamesWithUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GameWithUsers>>> {
        if (requestParameters.userName === null || requestParameters.userName === undefined) {
            throw new runtime.RequiredError('userName','Required parameter requestParameters.userName was null or undefined when calling gameControllerGetUserGamesWithUsers.');
        }

        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['sort'] = requestParameters.sort;
        }

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/games/users/{userName}`.replace(`{${"userName"}}`, encodeURIComponent(String(requestParameters.userName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GameWithUsersFromJSON));
    }

    /**
     */
    async gameControllerGetUserGamesWithUsers(requestParameters: GameControllerGetUserGamesWithUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GameWithUsers>> {
        const response = await this.gameControllerGetUserGamesWithUsersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetUserLevelHistoryRaw(requestParameters: GameControllerGetUserLevelHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<UserLevelWithTimestamp>>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling gameControllerGetUserLevelHistory.');
        }

        const queryParameters: any = {};

        if (requestParameters.mode !== undefined) {
            queryParameters['mode'] = requestParameters.mode;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/game/levels/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserLevelWithTimestampFromJSON));
    }

    /**
     */
    async gameControllerGetUserLevelHistory(requestParameters: GameControllerGetUserLevelHistoryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<UserLevelWithTimestamp>> {
        const response = await this.gameControllerGetUserLevelHistoryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerGetUserStatsRaw(requestParameters: GameControllerGetUserStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GameStats>> {
        if (requestParameters.username === null || requestParameters.username === undefined) {
            throw new runtime.RequiredError('username','Required parameter requestParameters.username was null or undefined when calling gameControllerGetUserStats.');
        }

        const queryParameters: any = {};

        if (requestParameters.mode !== undefined) {
            queryParameters['mode'] = requestParameters.mode;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/game/stats/{username}`.replace(`{${"username"}}`, encodeURIComponent(String(requestParameters.username))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GameStatsFromJSON(jsonValue));
    }

    /**
     */
    async gameControllerGetUserStats(requestParameters: GameControllerGetUserStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GameStats> {
        const response = await this.gameControllerGetUserStatsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async gameControllerRemoveGameRaw(requestParameters: GameControllerRemoveGameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.gameId === null || requestParameters.gameId === undefined) {
            throw new runtime.RequiredError('gameId','Required parameter requestParameters.gameId was null or undefined when calling gameControllerRemoveGame.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/game/{gameId}`.replace(`{${"gameId"}}`, encodeURIComponent(String(requestParameters.gameId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async gameControllerRemoveGame(requestParameters: GameControllerRemoveGameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.gameControllerRemoveGameRaw(requestParameters, initOverrides);
    }

}

/**
 * @export
 */
export const GameControllerGetGamesSortEnum = {
    True: 'true',
    False: 'false'
} as const;
export type GameControllerGetGamesSortEnum = typeof GameControllerGetGamesSortEnum[keyof typeof GameControllerGetGamesSortEnum];
/**
 * @export
 */
export const GameControllerGetUserGamesSortEnum = {
    True: 'true',
    False: 'false'
} as const;
export type GameControllerGetUserGamesSortEnum = typeof GameControllerGetUserGamesSortEnum[keyof typeof GameControllerGetUserGamesSortEnum];
/**
 * @export
 */
export const GameControllerGetUserGamesWithUsersSortEnum = {
    True: 'true',
    False: 'false'
} as const;
export type GameControllerGetUserGamesWithUsersSortEnum = typeof GameControllerGetUserGamesWithUsersSortEnum[keyof typeof GameControllerGetUserGamesWithUsersSortEnum];
/**
 * @export
 */
export const GameControllerGetUserLevelHistoryModeEnum = {
    Training: 'training',
    Classic: 'classic',
    ShortPaddle: 'shortPaddle',
    MysteryZone: 'mysteryZone',
    Unknown: 'unknown'
} as const;
export type GameControllerGetUserLevelHistoryModeEnum = typeof GameControllerGetUserLevelHistoryModeEnum[keyof typeof GameControllerGetUserLevelHistoryModeEnum];
/**
 * @export
 */
export const GameControllerGetUserStatsModeEnum = {
    Training: 'training',
    Classic: 'classic',
    ShortPaddle: 'shortPaddle',
    MysteryZone: 'mysteryZone',
    Unknown: 'unknown'
} as const;
export type GameControllerGetUserStatsModeEnum = typeof GameControllerGetUserStatsModeEnum[keyof typeof GameControllerGetUserStatsModeEnum];