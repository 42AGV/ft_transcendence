import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Chat, Landing, Play, Users } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CHAT_URL, PLAY_URL, USERS_URL } from './shared/urls';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path={USERS_URL} element={<Users />} />
        <Route path={PLAY_URL} element={<Play />} />
        <Route path={CHAT_URL} element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
