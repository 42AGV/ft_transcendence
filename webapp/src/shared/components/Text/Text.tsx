import './Text.css';

export enum TextColor {
  WARNING = 'Text-warning',
  SUBMIT = 'Text-submit',
  ONLINE = 'Text-online',
  OFFLINE = 'Text-offline',
  LIGHT = 'Text-light',
  BACKGROUND = 'Text-background',
  DARK = 'Text-dark',
  GAME = 'Text-game',
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
  color?: TextColor;
  size?: TextSize;
  weight?: TextWeight;
};

export default function Text({
  size = TextSize.MEDIUM,
  color = TextColor.DARK,
  weight = TextWeight.REGULAR,
  children,
}: TextProps) {
  return (
    <div style={{ fontSize: size, fontWeight: weight }} className={color}>
      {children}
    </div>
  );
}
