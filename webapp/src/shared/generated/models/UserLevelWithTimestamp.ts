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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface UserLevelWithTimestamp
 */
export interface UserLevelWithTimestamp {
    /**
     * 
     * @type {string}
     * @memberof UserLevelWithTimestamp
     */
    gameId: string;
    /**
     * 
     * @type {string}
     * @memberof UserLevelWithTimestamp
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof UserLevelWithTimestamp
     */
    gameMode: UserLevelWithTimestampGameModeEnum;
    /**
     * 
     * @type {Date}
     * @memberof UserLevelWithTimestamp
     */
    timestamp: Date;
    /**
     * 
     * @type {number}
     * @memberof UserLevelWithTimestamp
     */
    level: number;
}


/**
 * @export
 */
export const UserLevelWithTimestampGameModeEnum = {
    Training: 'training',
    Classic: 'classic',
    ShortPaddle: 'shortPaddle',
    MysteryZone: 'mysteryZone',
    Unknown: 'unknown'
} as const;
export type UserLevelWithTimestampGameModeEnum = typeof UserLevelWithTimestampGameModeEnum[keyof typeof UserLevelWithTimestampGameModeEnum];


/**
 * Check if a given object implements the UserLevelWithTimestamp interface.
 */
export function instanceOfUserLevelWithTimestamp(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "gameId" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "gameMode" in value;
    isInstance = isInstance && "timestamp" in value;
    isInstance = isInstance && "level" in value;

    return isInstance;
}

export function UserLevelWithTimestampFromJSON(json: any): UserLevelWithTimestamp {
    return UserLevelWithTimestampFromJSONTyped(json, false);
}

export function UserLevelWithTimestampFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserLevelWithTimestamp {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'gameId': json['gameId'],
        'username': json['username'],
        'gameMode': json['gameMode'],
        'timestamp': (new Date(json['timestamp'])),
        'level': json['level'],
    };
}

export function UserLevelWithTimestampToJSON(value?: UserLevelWithTimestamp | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'gameId': value.gameId,
        'username': value.username,
        'gameMode': value.gameMode,
        'timestamp': (value.timestamp.toISOString()),
        'level': value.level,
    };
}
