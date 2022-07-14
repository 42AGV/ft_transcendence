import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import '../Button/Button.css'
import {SmallAvatar, AvatarProps} from '../Avatar/Avatar';

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
          `{children[0]} {children[1]}`
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
