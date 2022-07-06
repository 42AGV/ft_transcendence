import { render, screen } from '@testing-library/react';
import { create } from 'react-test-renderer';
import Text, { TextColor, TextVariant, TextWeight } from '../Text';

test('renders default text', () => {
  render(<Text variant={TextVariant.PARAGRAPH}>Hello World!</Text>);

  const textElement = screen.getByText(/hello world!/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle({
    fontSize: TextVariant.PARAGRAPH.size,
    fontWeight: TextWeight.REGULAR,
  });
});

test('renders custom text', () => {
  render(
    <Text variant={TextVariant.HEADING} weight={TextWeight.BOLD}>
      Hello World!
    </Text>,
  );

  const textElement = screen.getByText(/hello world!/i);
  expect(textElement).toBeInTheDocument();
  expect(textElement).toHaveStyle({
    fontSize: TextVariant.HEADING.size,
    fontWeight: TextWeight.BOLD,
  });
});

test('renders correctly with default text', () => {
  const tree = create(
    <Text variant={TextVariant.TITLE}>Hello World!</Text>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders correctly with custom text', () => {
  const tree = create(
    <Text
      variant={TextVariant.TITLE}
      color={TextColor.LIGHT}
      weight={TextWeight.BOLD}
    >
      Hello World!
    </Text>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
