import {
  AuthApi,
  ChatApi,
  Configuration,
  GameApi,
  UsersApi,
} from '../generated';

const apiConfig = new Configuration({
  basePath: window.location.origin,
});
export const authApi = new AuthApi(apiConfig);
export const usersApi = new UsersApi(apiConfig);
export const chatApi = new ChatApi(apiConfig);
export const gameApi = new GameApi(apiConfig);
