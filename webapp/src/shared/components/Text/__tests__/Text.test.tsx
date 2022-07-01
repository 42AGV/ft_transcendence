import { render, screen } from '@testing-library/react';
import { create } from 'react-test-renderer';
import { Color } from '../../../types';
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

test('renders correctly with default text', () => {
  const tree = create(<Text>Hello World!</Text>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with custom text', () => {
  const tree = create(
    <Text
      size={TextSize.EXTRA_LARGE}
      color={Color.LIGHT}
      weight={TextWeight.BOLD}
    >
      Hello World!
    </Text>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
