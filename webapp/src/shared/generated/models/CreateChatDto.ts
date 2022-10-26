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
    name: string;
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
}

/**
 * Check if a given object implements the CreateChatDto interface.
 */
export function instanceOfCreateChatDto(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "confirmationPassword" in value;

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
        
        'name': json['name'],
        'password': json['password'],
        'confirmationPassword': json['confirmationPassword'],
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
        
        'name': value.name,
        'password': value.password,
        'confirmationPassword': value.confirmationPassword,
    };
}
