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
  UserDto,
} from '../models';
import {
    UpdateUserDtoFromJSON,
    UpdateUserDtoToJSON,
    UserFromJSON,
    UserToJSON,
    UserDtoFromJSON,
    UserDtoToJSON,
} from '../models';

export interface UserControllerAddUserRequest {
    userDto: UserDto;
}

export interface UserControllerGetAvatarRequest {
    uuid: string;
}

export interface UserControllerGetUserByIdRequest {
    uuid: string;
}

export interface UserControllerGetUsersRequest {
    limit?: number;
    offset?: number;
    sort?: UserControllerGetUsersSortEnum;
    search?: string;
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
    async userControllerGetAvatarRaw(requestParameters: UserControllerGetAvatarRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        if (requestParameters.uuid === null || requestParameters.uuid === undefined) {
            throw new runtime.RequiredError('uuid','Required parameter requestParameters.uuid was null or undefined when calling userControllerGetAvatar.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/{uuid}/avatar`.replace(`{${"uuid"}}`, encodeURIComponent(String(requestParameters.uuid))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async userControllerGetAvatar(requestParameters: UserControllerGetAvatarRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.userControllerGetAvatarRaw(requestParameters, initOverrides);
        return await response.value();
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
    async userControllerGetCurrentUserAvatarRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/avatar`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async userControllerGetCurrentUserAvatar(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
        const response = await this.userControllerGetCurrentUserAvatarRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async userControllerGetUserByIdRaw(requestParameters: UserControllerGetUserByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<User>> {
        if (requestParameters.uuid === null || requestParameters.uuid === undefined) {
            throw new runtime.RequiredError('uuid','Required parameter requestParameters.uuid was null or undefined when calling userControllerGetUserById.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/v1/users/{uuid}`.replace(`{${"uuid"}}`, encodeURIComponent(String(requestParameters.uuid))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserFromJSON(jsonValue));
    }

    /**
     */
    async userControllerGetUserById(requestParameters: UserControllerGetUserByIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<User> {
        const response = await this.userControllerGetUserByIdRaw(requestParameters, initOverrides);
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
    async userControllerUploadAvatarRaw(requestParameters: UserControllerUploadAvatarRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<any>> {
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

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async userControllerUploadAvatar(requestParameters: UserControllerUploadAvatarRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<any> {
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