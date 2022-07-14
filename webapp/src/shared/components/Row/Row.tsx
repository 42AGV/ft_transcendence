import Icon, { IconVariant, IconSize } from '../Icon/Icon';
import './Row.css';
import {SmallAvatar} from '../Avatar/Avatar';

type RowProps = {
  iconVariant?: IconVariant;
  onClick?: () => void;
  children: string;
};

export default function Row({
  iconVariant,
  onClick,
  children,
}: RowProps) {
  const randomAvatar = 'https://i.pravatar.cc/1000'
  return (
    <button
      className={`Row subheading-bold`}
      onClick={onClick}
    >
      <div>
      <SmallAvatar url={randomAvatar} />
      </div>
      <div>{children}</div>
      {iconVariant && (
        <div className="Row-icon">
          {<Icon variant={iconVariant} size={IconSize.SMALL}/>}
        </div>
      )}
    </button>
  );
}
