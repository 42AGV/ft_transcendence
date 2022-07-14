import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import '../Button/Button.css'
import {SmallAvatar, AvatarProps} from '../Avatar/Avatar';
import {TextColor, TextVariant, TextWeight} from "../Text/Text";
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
        <div className={`text_box_wrapper`}>
          <Text variant={TextVariant.PARAGRAPH}
                color={TextColor.LIGHT}
                weight={TextWeight.MEDIUM}>{children[0]}</Text>
          <Text variant={TextVariant.CAPTION}
                color={TextColor.LIGHT}
                weight={TextWeight.REGULAR}>{children[1]}</Text>
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
