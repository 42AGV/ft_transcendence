import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  ChatsPage,
  LandingPage,
  PlayPage,
  GameTrainPage,
  GameMultiplayerPage,
  UsersPage,
  UserPage,
  ComponentsBookPage,
  EditUserPage,
  EditUserAvatarPage,
  LoginPage,
  RegisterPage,
  ChatPage,
  ChatroomPage,
  CreateChatroomPage,
  AuthUserPage,
  EditChatroomDetailsPage,
  ChatroomDetailsPage,
  JoinChatroomPage,
  EditChatroomMemberPage,
  DiscoverChatsPage,
  EditUserPasswordPage,
  FriendsPage,
  EditChatroomAvatarPage,
  EnableTwoFactorAuthPage,
  ValidateTwoFactorAuthPage,
  GameRulesPage,
  UserMatchHistoryPage,
  UserStatsPage,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  CHAT_URL,
  CHATS_URL,
  PLAY_URL,
  USER_URL,
  USER_ME_URL,
  SEARCH_FRIENDS_URL,
  COMPONENTS_BOOK_URL,
  EDIT_USER_URL,
  EDIT_USER_AVATAR_URL,
  LOGIN_OPTIONS_URL,
  REGISTER_URL,
  CHATROOM_URL,
  CREATE_CHATROOM_URL,
  EDIT_USER_PASSWORD_URL,
  FRIENDS_URL,
  EDIT_CHATROOM_AVATAR_URL,
  PLAY_GAME_TRAIN_URL,
  PLAY_GAME_URL,
  ADMIN_URL,
  TWO_FACTOR_AUTH_ENABLE_URL,
  TWO_FACTOR_AUTH_VALIDATE_URL,
  PLAY_RULES_URL,
} from './shared/urls';
import { AuthProvider } from './shared/context/auth-context';
import RequireAuth from './shared/components/RequireAuth/RequireAuth';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { NotificationContextProvider } from './shared/context/NotificationContext';
import { UserStatusProvider } from './shared/context/UserStatusContext';
import { UserBlocklistProvider } from './shared/context/UserBlocklistContext';
import { UserFriendProvider } from './shared/context/UserFriendContext';
import RequireAdmin from './shared/components/RequireAdmin/RequireAdmin';
import { GamePairingProvider } from './shared/context/GamePairingContext';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Chart.overrides['doughnut'].plugins.legend.position = 'left';
const container = document.getElementById('root');
const root = createRoot(container!);
const developmentMode = process.env.NODE_ENV === 'development';

function AppContext({ children }: { children: JSX.Element }) {
  return (
    <NotificationContextProvider>
      <AuthProvider>
        <GamePairingProvider>
          <UserStatusProvider>
            <UserFriendProvider>
              <UserBlocklistProvider>{children}</UserBlocklistProvider>
            </UserFriendProvider>
          </UserStatusProvider>
        </GamePairingProvider>
      </AuthProvider>
    </NotificationContextProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path={LOGIN_OPTIONS_URL} element={<LoginPage />} />
      <Route path={REGISTER_URL} element={<RegisterPage />} />
      <Route
        path={SEARCH_FRIENDS_URL}
        element={
          <RequireAuth>
            <UsersPage />
          </RequireAuth>
        }
      />
      <Route
        path={FRIENDS_URL}
        element={
          <RequireAuth>
            <FriendsPage />
          </RequireAuth>
        }
      />
      <Route
        path={PLAY_URL}
        element={
          <RequireAuth>
            <PlayPage />
          </RequireAuth>
        }
      />
      <Route
        path={PLAY_RULES_URL}
        element={
          <RequireAuth>
            <GameRulesPage />
          </RequireAuth>
        }
      />
      <Route
        path={PLAY_GAME_URL}
        element={
          <RequireAuth>
            {/* Temporary until we implement the page which list the currently playing games */}
            <GameTrainPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${PLAY_GAME_URL}/:gameId`}
        element={
          <RequireAuth>
            <GameMultiplayerPage />
          </RequireAuth>
        }
      />
      <Route
        path={PLAY_GAME_TRAIN_URL}
        element={
          <RequireAuth>
            <GameTrainPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATS_URL}/discover`}
        element={
          <RequireAuth>
            <DiscoverChatsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATS_URL}`}
        element={
          <RequireAuth>
            <ChatsPage />
          </RequireAuth>
        }
      />
      <Route
        path={CREATE_CHATROOM_URL}
        element={
          <RequireAuth>
            <CreateChatroomPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${USER_URL}/:username`}
        element={
          <RequireAuth>
            <UserPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${USER_URL}/:username/history`}
        element={
          <RequireAuth>
            <UserMatchHistoryPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${USER_URL}/:username/stats`}
        element={
          <RequireAuth>
            <UserStatsPage />
          </RequireAuth>
        }
      />
      <Route
        path={USER_ME_URL}
        element={
          <RequireAuth>
            <AuthUserPage />
          </RequireAuth>
        }
      />
      <Route
        path={EDIT_USER_URL}
        element={
          <RequireAuth>
            <EditUserPage />
          </RequireAuth>
        }
      />
      <Route
        path={EDIT_USER_PASSWORD_URL}
        element={
          <RequireAuth>
            <EditUserPasswordPage />
          </RequireAuth>
        }
      />
      <Route
        path={EDIT_USER_AVATAR_URL}
        element={
          <RequireAuth>
            <EditUserAvatarPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHAT_URL}/:username`}
        element={
          <RequireAuth>
            <ChatPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATROOM_URL}/:chatroomId`}
        element={
          <RequireAuth>
            <ChatroomPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATROOM_URL}/:chatroomId/edit`}
        element={
          <RequireAuth>
            <EditChatroomDetailsPage />
          </RequireAuth>
        }
      />
      <Route
        path={EDIT_CHATROOM_AVATAR_URL}
        element={
          <RequireAuth>
            <EditChatroomAvatarPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATROOM_URL}/:chatroomId/member/:username/edit`}
        element={
          <RequireAuth>
            <EditChatroomMemberPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATROOM_URL}/:chatroomId/details`}
        element={
          <RequireAuth>
            <ChatroomDetailsPage />
          </RequireAuth>
        }
      />
      <Route
        path={`${CHATROOM_URL}/:chatroomId/join`}
        element={
          <RequireAuth>
            <JoinChatroomPage />
          </RequireAuth>
        }
      />
      <Route
        path={TWO_FACTOR_AUTH_ENABLE_URL}
        element={
          <RequireAuth>
            <EnableTwoFactorAuthPage />
          </RequireAuth>
        }
      />
      <Route
        path={ADMIN_URL}
        element={
          <RequireAdmin>
            <UsersPage />
          </RequireAdmin>
        }
      />
      <Route
        path={`${ADMIN_URL}${CHATS_URL}`}
        element={
          <RequireAdmin>
            <DiscoverChatsPage />
          </RequireAdmin>
        }
      />
      <Route
        path={`${ADMIN_URL}${USER_URL}/:username`}
        element={
          <RequireAdmin>
            <UserPage />
          </RequireAdmin>
        }
      />
      <Route
        path={`${ADMIN_URL}${CHATROOM_URL}/:chatroomId`}
        element={
          <RequireAdmin>
            <ChatroomPage />
          </RequireAdmin>
        }
      />
      <Route
        path={`${ADMIN_URL}${CHATROOM_URL}/:chatroomId/edit`}
        element={
          <RequireAdmin>
            <EditChatroomDetailsPage />
          </RequireAdmin>
        }
      />
      <Route
        path={`${ADMIN_URL}${CHATROOM_URL}/:chatroomId/member/:username/edit`}
        element={
          <RequireAdmin>
            <EditChatroomMemberPage />
          </RequireAdmin>
        }
      />
      <Route
        path={`${ADMIN_URL}${CHATROOM_URL}/:chatroomId/details`}
        element={
          <RequireAdmin>
            <ChatroomDetailsPage />
          </RequireAdmin>
        }
      />
      <Route
        path={TWO_FACTOR_AUTH_VALIDATE_URL}
        element={<ValidateTwoFactorAuthPage />}
      />
      {developmentMode && (
        <Route path={COMPONENTS_BOOK_URL} element={<ComponentsBookPage />} />
      )}
      <Route
        path="*"
        element={
          <RequireAuth>
            <NotFoundPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContext>
        <AppRoutes />
      </AppContext>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
