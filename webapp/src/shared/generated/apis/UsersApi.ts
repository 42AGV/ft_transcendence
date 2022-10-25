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
  UpdateUserDto,
  User,
  UserAvatarDto,
  UserDto,
} from '../models';
import {
    UpdateUserDtoFromJSON,
    UpdateUserDtoToJSON,
    UserFromJSON,
    UserToJSON,
    UserAvatarDtoFromJSON,
    UserAvatarDtoToJSON,
    UserDtoFromJSON,
    UserDtoToJSON,
} from '../models';

export interface UserControllerAddUserRequest {
    userDto: UserDto;
}

export interface UserControllerBlockUserRequest {
    userId: string;
}

export interface UserControllerGetAvatarByAvatarIdRequest {
    avatarId: string;
}

export interface UserControllerGetBlockRequest {
    userId: string;
}

export interface UserControllerGetUserByUserNameRequest {
    userName: string;
}

export interface UserControllerGetUsersRequest {
    limit?: number;
    offset?: number;
    sort?: UserControllerGetUsersSortEnum;
    search?: string;
}

export interface UserControllerUnblockUserRequest {
    userId: string;
}

export interface UserControllerUpdateCurrentUserRequest {
    updateUserDto: UpdateUserDto;
}

export interface UserControllerUploadAvatarRequest {
    file?: Blob;
}

/**
 * 
 */
export class UsersApi extends runtime.BaseAPI {

    /**
     */
    async userControllerAddUserRaw(requestParameters: UserControllerAddUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.userDto === null || requestParameters.userDto === undefined) {
            throw new runtime.RequiredError('userDto','Required parameter requestParameters.userDto was null or undefined when calling userControllerAddUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/users`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserDtoToJSON(requestParameters.userDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerAddUser(requestParameters: UserControllerAddUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userControllerAddUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerBlockUserRaw(requestParameters: UserControllerBlockUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling userControllerBlockUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/block/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async userControllerBlockUser(requestParameters: UserControllerBlockUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.userControllerBlockUserRaw(requestParameters, initOverrides);
    }

    /**
     */
    async userControllerGetAvatarByAvatarIdRaw(requestParameters: UserControllerGetAvatarByAvatarIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.avatarId === null || requestParameters.avatarId === undefined) {
            throw new runtime.RequiredError('avatarId','Required parameter requestParameters.avatarId was null or undefined when calling userControllerGetAvatarByAvatarId.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/avatars/{avatarId}`.replace(`{${"avatarId"}}`, encodeURIComponent(String(requestParameters.avatarId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async userControllerGetAvatarByAvatarId(requestParameters: UserControllerGetAvatarByAvatarIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.userControllerGetAvatarByAvatarIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerGetBlockRaw(requestParameters: UserControllerGetBlockRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling userControllerGetBlock.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/block/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async userControllerGetBlock(requestParameters: UserControllerGetBlockRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.userControllerGetBlockRaw(requestParameters, initOverrides);
    }

    /**
     */
    async userControllerGetCurrentUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/me`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerGetCurrentUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userControllerGetCurrentUserRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerGetUserByUserNameRaw(requestParameters: UserControllerGetUserByUserNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.userName === null || requestParameters.userName === undefined) {
            throw new runtime.RequiredError('userName','Required parameter requestParameters.userName was null or undefined when calling userControllerGetUserByUserName.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/{userName}`.replace(`{${"userName"}}`, encodeURIComponent(String(requestParameters.userName))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerGetUserByUserName(requestParameters: UserControllerGetUserByUserNameRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userControllerGetUserByUserNameRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerGetUsersRaw(requestParameters: UserControllerGetUsersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<User>>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['limit'] = requestParameters.limit;
        }

        if (requestParameters.offset !== undefined) {
            queryParameters['offset'] = requestParameters.offset;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['sort'] = requestParameters.sort;
        }

        if (requestParameters.search !== undefined) {
            queryParameters['search'] = requestParameters.search;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(UserFromJSON));
    }

    /**
     */
    async userControllerGetUsers(requestParameters: UserControllerGetUsersRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<User>> {
        const response = await this.userControllerGetUsersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerUnblockUserRaw(requestParameters: UserControllerUnblockUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.userId === null || requestParameters.userId === undefined) {
            throw new runtime.RequiredError('userId','Required parameter requestParameters.userId was null or undefined when calling userControllerUnblockUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/block/{userId}`.replace(`{${"userId"}}`, encodeURIComponent(String(requestParameters.userId))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async userControllerUnblockUser(requestParameters: UserControllerUnblockUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.userControllerUnblockUserRaw(requestParameters, initOverrides);
    }

    /**
     */
    async userControllerUpdateCurrentUserRaw(requestParameters: UserControllerUpdateCurrentUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.updateUserDto === null || requestParameters.updateUserDto === undefined) {
            throw new runtime.RequiredError('updateUserDto','Required parameter requestParameters.updateUserDto was null or undefined when calling userControllerUpdateCurrentUser.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/v1/users`,
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: UpdateUserDtoToJSON(requestParameters.updateUserDto),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerUpdateCurrentUser(requestParameters: UserControllerUpdateCurrentUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userControllerUpdateCurrentUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerUploadAvatarRaw(requestParameters: UserControllerUploadAvatarRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserAvatarDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const consumes: runtime.Consume[] = [
            { contentType: 'multipart/form-data' },
        ];
        // @ts-ignore: canConsumeForm may be unused
        const canConsumeForm = runtime.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any };
        let useForm = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new URLSearchParams();
        }

        if (requestParameters.file !== undefined) {
            formParams.append('file', requestParameters.file as any);
        }

        const response = await this.request({
            path: `/api/v1/users/avatar`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: formParams,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserAvatarDtoFromJSON(jsonValue));
    }

    /**
     */
    async userControllerUploadAvatar(requestParameters: UserControllerUploadAvatarRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserAvatarDto> {
        const response = await this.userControllerUploadAvatarRaw(requestParameters, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const UserControllerGetUsersSortEnum = {
    True: 'true',
    False: 'false'
} as const;
export type UserControllerGetUsersSortEnum = typeof UserControllerGetUsersSortEnum[keyof typeof UserControllerGetUsersSortEnum];
