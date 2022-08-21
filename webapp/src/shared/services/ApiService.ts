import { AuthApi, Configuration, UsersApi } from '../generated';

const apiConfig = new Configuration({
  basePath: window.location.origin,
});
export const authApi = new AuthApi(apiConfig);
export const usersApi = new UsersApi(apiConfig);