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
 * @interface UserWithLevelDto
 */
export interface UserWithLevelDto {
    /**
     * 
     * @type {string}
     * @memberof UserWithLevelDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithLevelDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithLevelDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithLevelDto
     */
    fullName: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithLevelDto
     */
    avatarId: string;
    /**
     * 
     * @type {number}
     * @memberof UserWithLevelDto
     */
    avatarX: number;
    /**
     * 
     * @type {number}
     * @memberof UserWithLevelDto
     */
    avatarY: number;
    /**
     * 
     * @type {Date}
     * @memberof UserWithLevelDto
     */
    createdAt: Date;
    /**
     * 
     * @type {boolean}
     * @memberof UserWithLevelDto
     */
    isTwoFactorAuthenticationEnabled: boolean;
    /**
     * 
     * @type {number}
     * @memberof UserWithLevelDto
     */
    level: number;
}

/**
 * Check if a given object implements the UserWithLevelDto interface.
 */
export function instanceOfUserWithLevelDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "username" in value;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "fullName" in value;
    isInstance = isInstance && "avatarId" in value;
    isInstance = isInstance && "avatarX" in value;
    isInstance = isInstance && "avatarY" in value;
    isInstance = isInstance && "createdAt" in value;
    isInstance = isInstance && "isTwoFactorAuthenticationEnabled" in value;
    isInstance = isInstance && "level" in value;

    return isInstance;
}

export function UserWithLevelDtoFromJSON(json: any): UserWithLevelDto {
    return UserWithLevelDtoFromJSONTyped(json, false);
}

export function UserWithLevelDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserWithLevelDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'username': json['username'],
        'email': json['email'],
        'fullName': json['fullName'],
        'avatarId': json['avatarId'],
        'avatarX': json['avatarX'],
        'avatarY': json['avatarY'],
        'createdAt': (new Date(json['createdAt'])),
        'isTwoFactorAuthenticationEnabled': json['isTwoFactorAuthenticationEnabled'],
        'level': json['level'],
    };
}

export function UserWithLevelDtoToJSON(value?: UserWithLevelDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'username': value.username,
        'email': value.email,
        'fullName': value.fullName,
        'avatarId': value.avatarId,
        'avatarX': value.avatarX,
        'avatarY': value.avatarY,
        'createdAt': (value.createdAt.toISOString()),
        'isTwoFactorAuthenticationEnabled': value.isTwoFactorAuthenticationEnabled,
        'level': value.level,
    };
}

