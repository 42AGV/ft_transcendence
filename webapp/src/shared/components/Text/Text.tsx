import { Color } from '../../types';
import React from "react";

export class TextVariant {
  public static TITLE = new TextVariant('h1', 'title-bold');
  public static SUBTITLE = new TextVariant('h2', 'subtitle-bold');
  public static HEADING = new TextVariant('h3', 'heading-bold');
  public static SUBHEADING = new TextVariant('h4', 'subheading-bold');
  public static PARAGRAPH = new TextVariant('p', 'paragraph-regular');
  public static CAPTION = new TextVariant('p', 'caption-regular');

  private constructor(public tag: string, public className: string) {}
}

enum CustomTextColor {
  GAME = 'text-color-game',
}

type TextColor = Color | CustomTextColor;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentionally naming the variable the same as the type
export const TextColor = { ...Color, ...CustomTextColor };

export enum TextWeight {
  REGULAR = '400',
  MEDIUM = '500',
  BOLD = '700',
}

type TextProps = {
  variant: TextVariant;
  color?: TextColor;
  weight?: TextWeight;
  children: string;
};

export default function Text({ variant, color, weight, children }: TextProps) {
  const { tag, className } = variant;
  const TextTag = tag as React.ElementType;
  const textClassName = `${className} ${color ? color : ''}`;

  return (
    <TextTag style={{ fontWeight: weight }} className={textClassName}>
      {children}
    </TextTag>
  );
}
