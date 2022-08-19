import {
  Text,
  TextVariant,
  TextWeight,
  TextColor,
} from '../../shared/components';
import React from 'react';

type singleOrMultipleChildren = React.ReactElement | React.ReactElement[];

type bookSectionProps = {
  title: string;
  displayVertical?: boolean;
  children: singleOrMultipleChildren;
};

type bookSubsectionProps = {
  title: string;
  children: singleOrMultipleChildren;
};

const wrapExample = (elements: singleOrMultipleChildren) =>
  Array.isArray(elements) ? (
    elements.map((el, index) => (
      <div className="components-book__section__example-wrapper" key={index}>
        {el}
      </div>
    ))
  ) : (
    <div className="components-book__section__example-wrapper">{elements}</div>
  );

export const BookSection = ({
  title,
  displayVertical,
  children,
}: bookSectionProps) => (
  <section className="components-book__section">
    <div className="components-book__section__title">
      <Text
        variant={TextVariant.HEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        {title}
      </Text>
    </div>
    <div
      className={`components-book__section__items${
        displayVertical ? '-vertical' : ''
      }`}
    >
      {wrapExample(children)}
    </div>
  </section>
);

export const BookSubsection = ({ title, children }: bookSubsectionProps) => (
  <div className="components-book__sub-section">
    {children}
    <Text
      variant={TextVariant.CAPTION}
      color={TextColor.LIGHT}
      weight={TextWeight.REGULAR}
    >
      {`ℹ️​ ${title}`}
    </Text>
  </div>
);
