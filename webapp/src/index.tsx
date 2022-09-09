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
  Login,
} from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  CHAT_URL,
  PLAY_URL,
  USERS_URL,
  COMPONENTS_BOOK_URL,
  USER_URL,
  EDIT_USER_URL,
  EDIT_AVATAR_URL,
  LOGIN_OPTIONS_URL,
} from './shared/urls';
import { AuthProvider } from './shared/context/auth-context';
import RequireAuth from './shared/components/RequireAuth/RequireAuth';

const container = document.getElementById('root');
const root = createRoot(container!);
const developmentMode = process.env.NODE_ENV === 'development';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path={LOGIN_OPTIONS_URL} element={<Login />} />
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
            path={USER_URL}
            element={
              <RequireAuth>
                <UserPage isMe={true} />
              </RequireAuth>
            }
          />
          <Route
            path={`${USERS_URL}/:id`}
            element={
              <RequireAuth>
                <UserPage isMe={false} />
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
          {developmentMode && (
            <Route
              path={COMPONENTS_BOOK_URL}
              element={<ComponentsBookPage />}
            />
          )}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
