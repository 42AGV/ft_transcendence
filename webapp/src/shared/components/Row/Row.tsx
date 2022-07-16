import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import '../Button/Button.css';
import { SmallAvatar, AvatarProps } from '../Avatar/Avatar';
import { TextVariant, TextWeight } from '../Text/Text';
import { default as Text } from '../Text/Text';

type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  avProps?: AvatarProps;
  children?: string[];
};

export default function Row({
  iconVariant,
  onClick,
  avProps,
  children,
}: RowProps) {
  return (
    <button className={`row paragraph-regular`} onClick={onClick}>
      <div className={`row_wrapper`}>
        {avProps && <SmallAvatar {...avProps} />}
        {children && (
          <div className={`row_text_wrapper`}>
            {children[0] && (
              <Text
                variant={TextVariant.PARAGRAPH}
                weight={TextWeight.MEDIUM}
                parent_class="row_text_wrapper"
              >
                {children[0]}
              </Text>
            )}
            {children[1] && (
              <Text
                variant={TextVariant.CAPTION}
                weight={TextWeight.REGULAR}
                parent_class="row_text_wrapper"
              >
                {children[1]}
              </Text>
            )}
          </div>
        )}
      </div>
      {iconVariant && (
        <div className="row-icon">
          {<Icon variant={iconVariant} size={IconSize.SMALL} />}
        </div>
      )}
    </button>
  );
}
