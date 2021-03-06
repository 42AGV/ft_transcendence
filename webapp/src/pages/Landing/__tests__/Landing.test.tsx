import { render, screen } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom/server';
import Landing from '../Landing';

test('renders landing', () => {
  render(
    <StaticRouter location="/">
      <Landing />
    </StaticRouter>,
  );
  const element = screen.getByText(/landing/i);
  expect(element).toBeInTheDocument();
});
