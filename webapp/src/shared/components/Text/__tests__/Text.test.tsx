import { render, screen } from '@testing-library/react';
import Text, { TextSize, TextWeight } from '../Text';

test('renders default text', () => {
  render(<Text>Hello World!</Text>);

  const textElement = screen.getByText(/hello world!/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle({
    fontSize: TextSize.MEDIUM,
    fontWeight: TextWeight.REGULAR,
  });
});

test('renders custom text', () => {
  render(
    <Text size={TextSize.EXTRA_LARGE} weight={TextWeight.BOLD}>
      Hello World!
    </Text>,
  );

  const textElement = screen.getByText(/hello world!/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle({
    fontSize: TextSize.EXTRA_LARGE,
    fontWeight: TextWeight.BOLD,
  });
});
