import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Chat, Landing, Play, Users, UserPage, ComponentsBook } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  CHAT_URL,
  PLAY_URL,
  USERS_URL,
  COMPONENTS_BOOK_URL,
  USER_URL,
} from './shared/urls';

const container = document.getElementById('root');
const root = createRoot(container!);
const developmentMode = process.env.NODE_ENV === 'development';

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={USERS_URL} element={<Users />} />
        <Route path={PLAY_URL} element={<Play />} />
        <Route path={CHAT_URL} element={<Chat />} />
        <Route path={USER_URL} element={<UserPage />} />
        {developmentMode && (
          <Route path={COMPONENTS_BOOK_URL} element={<ComponentsBook />} />
        )}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
