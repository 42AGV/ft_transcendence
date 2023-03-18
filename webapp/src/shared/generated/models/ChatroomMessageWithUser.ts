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
import type { User } from './User';
import {
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './User';

/**
 * 
 * @export
 * @interface ChatroomMessageWithUser
 */
export interface ChatroomMessageWithUser {
    /**
     * 
     * @type {User}
     * @memberof ChatroomMessageWithUser
     */
    user: User;
    /**
     * 
     * @type {string}
     * @memberof ChatroomMessageWithUser
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ChatroomMessageWithUser
     */
    chatroomId: string;
    /**
     * 
     * @type {string}
     * @memberof ChatroomMessageWithUser
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof ChatroomMessageWithUser
     */
    content: string;
    /**
     * 
     * @type {Date}
     * @memberof ChatroomMessageWithUser
     */
    createdAt: Date;
}

/**
 * Check if a given object implements the ChatroomMessageWithUser interface.
 */
export function instanceOfChatroomMessageWithUser(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "user" in value;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "chatroomId" in value;
    isInstance = isInstance && "userId" in value;
    isInstance = isInstance && "content" in value;
    isInstance = isInstance && "createdAt" in value;

    return isInstance;
}

export function ChatroomMessageWithUserFromJSON(json: any): ChatroomMessageWithUser {
    return ChatroomMessageWithUserFromJSONTyped(json, false);
}

export function ChatroomMessageWithUserFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChatroomMessageWithUser {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'user': UserFromJSON(json['user']),
        'id': json['id'],
        'chatroomId': json['chatroomId'],
        'userId': json['userId'],
        'content': json['content'],
        'createdAt': (new Date(json['createdAt'])),
    };
}

export function ChatroomMessageWithUserToJSON(value?: ChatroomMessageWithUser | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'user': UserToJSON(value.user),
        'id': value.id,
        'chatroomId': value.chatroomId,
        'userId': value.userId,
        'content': value.content,
        'createdAt': (value.createdAt.toISOString()),
    };
}

