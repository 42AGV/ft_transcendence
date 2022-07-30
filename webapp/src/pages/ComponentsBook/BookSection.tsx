import {
  Text,
  TextVariant,
  TextWeight,
  TextColor,
} from '../../shared/components';

type singleOrMultipleChildren = React.ReactElement | React.ReactElement[];

type bookSectionProps = {
  title: string;
  children: singleOrMultipleChildren;
};

const wrapExample = (elements: singleOrMultipleChildren) =>
  Array.isArray(elements) ? (
    elements.map((el) => (
      <div className="components-book__section__example-wrapper">{el}</div>
    ))
  ) : (
    <div className="components-book__section__example-wrapper">{elements}</div>
  );

export const BookSection = ({ title, children }: bookSectionProps) => (
  <section className="components-book__section">
    <div  className="components-book__section__title">
      <Text
        variant={TextVariant.HEADING}
        color={TextColor.LIGHT}
        weight={TextWeight.BOLD}
      >
        {` ${title}`}
      </Text>
    </div>
    <div className="components-book__section__items">
      {wrapExample(children)}
    </div>
  </section>
);
