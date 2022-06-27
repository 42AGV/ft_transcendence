import { render, screen } from '@testing-library/react';
import Landing from '../';

test('renders landing', () => {
  render(<Landing />);
  const element = screen.getByText(/landing/i);
  expect(element).toBeInTheDocument();
});
