import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import '../Button/Button.css'
import {SmallAvatar, AvatarProps} from '../Avatar/Avatar';
import {TextVariant, TextWeight} from "../Text/Text";
import {default as Text} from "../Text/Text";

type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  avProps : AvatarProps;
  children: string[];
};

export default function Row({
  iconVariant,
  onClick,
  avProps,
  children,
}: RowProps) {
  return (
    <button
      className={`row paragraph-regular`}
      onClick={onClick}
    >
      <div className={`row_wrapper`}>
        <SmallAvatar {...avProps} />
        <div className={`row_text_wrapper`}>
          <Text variant={TextVariant.PARAGRAPH}
                weight={TextWeight.MEDIUM} classname='row_text_wrapper' >{children[0]}</Text>
          <Text variant={TextVariant.CAPTION}
                weight={TextWeight.REGULAR} classname='row_text_wrapper' >{children[1]}</Text>
        </div>
      </div>
      {iconVariant && (
        <div className="row-icon">
          {<Icon variant={iconVariant} size={IconSize.SMALL}/>}
        </div>
      )}
    </button>
  );
}
