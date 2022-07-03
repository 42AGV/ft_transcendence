import './Text.css';

export enum TextType {
  HEADER = 'h1',
  TITLE = 'h3',
  SUBTITLE = 'h5',
  DESCRIPTION = 'p',
}

export enum TextColor {
  WARNING = 'text-warning',
  SUBMIT = 'text-submit',
  ONLINE = 'text-online',
  OFFLINE = 'text-offline',
  LIGHT = 'text-light',
  BACKGROUND = 'text-background',
  DARK = 'text-dark',
  GAME = 'text-game',
}

export enum TextSize {
  EXTRA_SMALL = '0.75rem',
  SMALL = '0.875rem',
  SMALL_MEDIUM = '1rem',
  MEDIUM = '1.25rem',
  MEDIUM_LARGE = '1.5rem',
  LARGE = '2.5rem',
  EXTRA_LARGE = '3rem',
}

export enum TextWeight {
  REGULAR = '400',
  MEDIUM = '500',
  BOLD = '700',
}

type TextProps = {
  children: string;
  type: TextType;
  color?: TextColor;
  size?: TextSize;
  weight?: TextWeight;
};

export default function Text({
  type,
  size = TextSize.MEDIUM,
  color = TextColor.DARK,
  weight = TextWeight.REGULAR,
  children,
}: TextProps) {
  const TextTag = type as React.ElementType;

  return (
    <TextTag style={{ fontSize: size, fontWeight: weight }} className={color}>
      {children}
    </TextTag>
  );
}
