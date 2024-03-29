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
 * @interface UserWithAuthorizationResponseDto
 */
export interface UserWithAuthorizationResponseDto {
    /**
     * 
     * @type {string}
     * @memberof UserWithAuthorizationResponseDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithAuthorizationResponseDto
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithAuthorizationResponseDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithAuthorizationResponseDto
     */
    fullName: string;
    /**
     * 
     * @type {string}
     * @memberof UserWithAuthorizationResponseDto
     */
    avatarId: string;
    /**
     * 
     * @type {number}
     * @memberof UserWithAuthorizationResponseDto
     */
    avatarX: number;
    /**
     * 
     * @type {number}
     * @memberof UserWithAuthorizationResponseDto
     */
    avatarY: number;
    /**
     * 
     * @type {Date}
     * @memberof UserWithAuthorizationResponseDto
     */
    createdAt: Date;
    /**
     * 
     * @type {boolean}
     * @memberof UserWithAuthorizationResponseDto
     */
    isTwoFactorAuthenticationEnabled: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserWithAuthorizationResponseDto
     */
    isLocal: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserWithAuthorizationResponseDto
     */
    gOwner: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserWithAuthorizationResponseDto
     */
    gAdmin: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserWithAuthorizationResponseDto
     */
    gBanned: boolean;
    /**
     * 
     * @type {number}
     * @memberof UserWithAuthorizationResponseDto
     */
    level: number;
}

/**
 * Check if a given object implements the UserWithAuthorizationResponseDto interface.
 */
export function instanceOfUserWithAuthorizationResponseDto(value: object): boolean {
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
    isInstance = isInstance && "isLocal" in value;
    isInstance = isInstance && "gOwner" in value;
    isInstance = isInstance && "gAdmin" in value;
    isInstance = isInstance && "gBanned" in value;
    isInstance = isInstance && "level" in value;

    return isInstance;
}

export function UserWithAuthorizationResponseDtoFromJSON(json: any): UserWithAuthorizationResponseDto {
    return UserWithAuthorizationResponseDtoFromJSONTyped(json, false);
}

export function UserWithAuthorizationResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserWithAuthorizationResponseDto {
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
        'isLocal': json['isLocal'],
        'gOwner': json['gOwner'],
        'gAdmin': json['gAdmin'],
        'gBanned': json['gBanned'],
        'level': json['level'],
    };
}

export function UserWithAuthorizationResponseDtoToJSON(value?: UserWithAuthorizationResponseDto | null): any {
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
        'isLocal': value.isLocal,
        'gOwner': value.gOwner,
        'gAdmin': value.gAdmin,
        'gBanned': value.gBanned,
        'level': value.level,
    };
}

