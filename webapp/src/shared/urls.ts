// webapp
export const HOST_URL = `/`;
export const LOGIN_OPTIONS_URL = '/login';
export const REGISTER_URL = '/register';
export const USER_URL = '/user';
export const USERS_URL = '/users';
export const EDIT_USER_URL = `${USER_URL}/edit`;
export const EDIT_AVATAR_URL = `${USER_URL}/edit/avatar`;
export const PLAY_URL = '/play';
export const CHAT_URL = '/chat';
export const COMPONENTS_BOOK_URL = '/components-book';
export const DEFAULT_LOGIN_REDIRECT_URL = `${USERS_URL}`;

// transcendence-app
const API_ENDPOINT_URL = '/api/v1';
export const LOGIN_EP_URL = `${API_ENDPOINT_URL}/auth/login`;
export const LOGOUT_EP_URL = `${API_ENDPOINT_URL}/auth/logout`;
export const USERS_EP_URL = `${API_ENDPOINT_URL}${USERS_URL}`;
export const AVATAR_EP_URL = `${USERS_EP_URL}/avatars`;

// others
export const WILDCARD_AVATAR_URL = 'https://i.pravatar.cc/1000';
