import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  ChatPage,
  LandingPage,
  PlayPage,
  UsersPage,
  UserPage,
  ComponentsBookPage,
  EditUserPage,
  EditAvatarPage,
  LoginPage,
  RegisterPage,
  ChatroomPage,
  CreateChatroomPage,
  AuthUserPage,
  ChatroomDetailsPage,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  CHAT_URL,
  PLAY_URL,
  USER_URL,
  USER_ME_URL,
  USERS_URL,
  COMPONENTS_BOOK_URL,
  EDIT_USER_URL,
  EDIT_AVATAR_URL,
  LOGIN_OPTIONS_URL,
  REGISTER_URL,
  CHATROOM_URL,
  CREATE_CHATROOM_URL,
} from './shared/urls';
import { AuthProvider } from './shared/context/auth-context';
import RequireAuth from './shared/components/RequireAuth/RequireAuth';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { NotificationContextProvider } from './shared/context/NotificationContext';

const container = document.getElementById('root');
const root = createRoot(container!);
const developmentMode = process.env.NODE_ENV === 'development';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationContextProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path={LOGIN_OPTIONS_URL} element={<LoginPage />} />
            <Route path={REGISTER_URL} element={<RegisterPage />} />
            <Route
              path={USERS_URL}
              element={
                <RequireAuth>
                  <UsersPage />
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
              path={CHAT_URL}
              element={
                <RequireAuth>
                  <ChatPage />
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
              path={EDIT_AVATAR_URL}
              element={
                <RequireAuth>
                  <EditAvatarPage />
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
              path={`${CHATROOM_URL}/:chatroomId/details`}
              element={
                <RequireAuth>
                  <ChatroomDetailsPage />
                </RequireAuth>
              }
            />
            {developmentMode && (
              <Route
                path={COMPONENTS_BOOK_URL}
                element={<ComponentsBookPage />}
              />
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
        </NotificationContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
