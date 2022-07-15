import { Color } from '../../types';
import React from "react";

export class TextVariant {
  public static TITLE = new TextVariant('h1', '3rem');
  public static SUBTITLE = new TextVariant('h2', '2.5rem');
  public static HEADING = new TextVariant('h3', '1.5rem');
  public static SUBHEADING = new TextVariant('h4', '1.25rem');
  public static PARAGRAPH = new TextVariant('p', '1rem');
  public static CAPTION = new TextVariant('p', '0.875rem');

  private constructor(public tag: string, public size: string) {}
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
  classname?: string;
};

export default function Text({
  variant,
  color,
  weight = TextWeight.REGULAR,
  children,
  classname
}: TextProps) {
  const { tag, size } = variant;
  const TextTag = tag as React.ElementType;
  const classesnames = color ?
    (classname ? `${color} ${classname}` : `${color}`) :
    (classname ? `${classname}` : undefined);

  return (
    <div>
    {classesnames && (
      <TextTag style={{ fontSize: size, fontWeight: weight }} className={classesnames}>
      {children}
    </TextTag>
    ) || (<TextTag style={{ fontSize: size, fontWeight: weight }} className={TextColor.DARK}>
      {children}
    </TextTag>)}
    </div>
  );
}
