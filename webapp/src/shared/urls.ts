// webapp
export const HOST_URL = `/`;
export const LOGIN_OPTIONS_URL = '/login';
export const REGISTER_URL = '/register';
export const USER_URL = '/user';
export const USER_ME_URL = '/myprofile';
export const FRIENDS_URL = '/friends';
export const USERS_URL = '/users';
export const SEARCH_FRIENDS_URL = '/friends/search';
export const EDIT_USER_URL = `${USER_ME_URL}/edit`;
export const EDIT_USER_PASSWORD_URL = `${USER_ME_URL}/edit/password`;
export const EDIT_USER_AVATAR_URL = `${USER_ME_URL}/edit/avatar`;
export const PLAY_URL = '/play';
export const PLAY_RULES_URL = '/play/rules';
export const PLAY_GAME_URL = '/play/game';
export const PLAY_GAME_TRAIN_URL = '/play/game-train';
export const CHAT_URL = '/chat';
export const CHATS_URL = '/chats';
export const ADMIN_URL = '/admin';
export const CHATROOM_URL = '/chatroom';
export const CREATE_CHATROOM_URL = `${CHATROOM_URL}/createchatroom`;
export const EDIT_CHATROOM_AVATAR_URL = `${CHATROOM_URL}/:chatroomId/edit/avatar`;
export const COMPONENTS_BOOK_URL = '/components-book';
export const DEFAULT_LOGIN_REDIRECT_URL = `${FRIENDS_URL}`;
export const TWO_FACTOR_AUTH_ENABLE_URL = `${USER_ME_URL}/2fa`;
export const TWO_FACTOR_AUTH_VALIDATE_URL = `${LOGIN_OPTIONS_URL}/2fa`;

// transcendence-app
const API_ENDPOINT_URL = '/api/v1';
export const LOGIN_EP_URL = `${API_ENDPOINT_URL}/auth/login`;
export const LOGOUT_EP_URL = `${API_ENDPOINT_URL}/auth/logout`;
export const USERS_EP_URL = `${API_ENDPOINT_URL}${USERS_URL}`;
export const CHATROOM_EP_URL = `${API_ENDPOINT_URL}/chat/room`;
export const AVATAR_EP_URL = `${API_ENDPOINT_URL}/avatar`;
export const TWO_FACTOR_AUTH_QR_EP_URL = `${API_ENDPOINT_URL}/auth/2fa/qrcode`;

// others
export const WILDCARD_AVATAR_URL = 'https://i.pravatar.cc/1000';
