import { Color } from '../../types';

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
  size?: TextSize;
  color?: Color;
  weight?: TextWeight;
};

export default function Text({
  size = TextSize.MEDIUM,
  color = Color.DARK,
  weight = TextWeight.REGULAR,
  children,
}: TextProps) {
  return (
    <div style={{ fontSize: size, color: `var(${color})`, fontWeight: weight }}>
      {children}
    </div>
  );
}
