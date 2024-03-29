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
 * @interface UserBlockRelation
 */
export interface UserBlockRelation {
    /**
     * 
     * @type {boolean}
     * @memberof UserBlockRelation
     */
    isUserBlockedByMe: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof UserBlockRelation
     */
    amIBlockedByUser: boolean;
}

/**
 * Check if a given object implements the UserBlockRelation interface.
 */
export function instanceOfUserBlockRelation(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "isUserBlockedByMe" in value;
    isInstance = isInstance && "amIBlockedByUser" in value;

    return isInstance;
}

export function UserBlockRelationFromJSON(json: any): UserBlockRelation {
    return UserBlockRelationFromJSONTyped(json, false);
}

export function UserBlockRelationFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserBlockRelation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'isUserBlockedByMe': json['isUserBlockedByMe'],
        'amIBlockedByUser': json['amIBlockedByUser'],
    };
}

export function UserBlockRelationToJSON(value?: UserBlockRelation | null): any {
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

