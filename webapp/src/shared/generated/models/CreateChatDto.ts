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
 * @interface CreateChatDto
 */
export interface CreateChatDto {
    /**
     * 
     * @type {string}
     * @memberof CreateChatDto
     */
    chatName: string;
    /**
     * 
     * @type {string}
     * @memberof CreateChatDto
     */
    password: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateChatDto
     */
    confirmationPassword: string | null;
    /**
     * 
     * @type {string}
     * @memberof CreateChatDto
     */
    owner: string;
}

/**
 * Check if a given object implements the CreateChatDto interface.
 */
export function instanceOfCreateChatDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "chatName" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "confirmationPassword" in value;
    isInstance = isInstance && "owner" in value;

    return isInstance;
}

export function CreateChatDtoFromJSON(json: any): CreateChatDto {
    return CreateChatDtoFromJSONTyped(json, false);
}

export function CreateChatDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateChatDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'chatName': json['chatName'],
        'password': json['password'],
        'confirmationPassword': json['confirmationPassword'],
        'owner': json['owner'],
    };
}

export function CreateChatDtoToJSON(value?: CreateChatDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'chatName': value.chatName,
        'password': value.password,
        'confirmationPassword': value.confirmationPassword,
        'owner': value.owner,
    };
}

