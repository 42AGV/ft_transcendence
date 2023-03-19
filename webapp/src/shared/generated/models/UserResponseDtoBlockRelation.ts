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
 * @interface UserResponseDtoBlockRelation
 */
export interface UserResponseDtoBlockRelation {
    /**
     * 
     * @type {boolean}
     * @memberof UserResponseDtoBlockRelation
     */
    isUserBlockedByMe: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserResponseDtoBlockRelation
     */
    amIBlockedByUser: boolean;
}

/**
 * Check if a given object implements the UserResponseDtoBlockRelation interface.
 */
export function instanceOfUserResponseDtoBlockRelation(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "isUserBlockedByMe" in value;
    isInstance = isInstance && "amIBlockedByUser" in value;

    return isInstance;
}

export function UserResponseDtoBlockRelationFromJSON(json: any): UserResponseDtoBlockRelation {
    return UserResponseDtoBlockRelationFromJSONTyped(json, false);
}

export function UserResponseDtoBlockRelationFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserResponseDtoBlockRelation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'isUserBlockedByMe': json['isUserBlockedByMe'],
        'amIBlockedByUser': json['amIBlockedByUser'],
    };
}

export function UserResponseDtoBlockRelationToJSON(value?: UserResponseDtoBlockRelation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'isUserBlockedByMe': value.isUserBlockedByMe,
        'amIBlockedByUser': value.amIBlockedByUser,
    };
}
