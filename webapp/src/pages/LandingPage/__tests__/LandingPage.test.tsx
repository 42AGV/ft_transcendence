import { render, screen } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom/server';
import LandingPage from '../LandingPage';

test('renders landing', () => {
  render(
    <StaticRouter location="/">
      <LandingPage />
    </StaticRouter>,
  );
  const element = screen.getByText(/Play online pong with your friends/i);
  expect(element).toBeInTheDocument();
});
