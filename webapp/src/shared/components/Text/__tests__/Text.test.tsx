import { render, screen } from '@testing-library/react';
import { create } from 'react-test-renderer';
import Text, { TextColor, TextSize, TextType, TextWeight } from '../Text';

test('renders default text', () => {
  render(<Text type={TextType.DESCRIPTION}>Hello World!</Text>);

  const textElement = screen.getByText(/hello world!/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle({
    fontSize: TextSize.MEDIUM,
    fontWeight: TextWeight.REGULAR,
  });
});

test('renders custom text', () => {
  render(
    <Text
      type={TextType.HEADER}
      size={TextSize.EXTRA_LARGE}
      weight={TextWeight.BOLD}
    >
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
  const tree = create(<Text type={TextType.TITLE}>Hello World!</Text>).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with custom text', () => {
  const tree = create(
    <Text
      type={TextType.TITLE}
      size={TextSize.EXTRA_LARGE}
      color={TextColor.LIGHT}
      weight={TextWeight.BOLD}
    >
      Hello World!
    </Text>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
