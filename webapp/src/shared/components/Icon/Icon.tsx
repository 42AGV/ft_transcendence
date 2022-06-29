import { Color } from '../../types/colors';
import {
  ArrowBack,
  ArrowForward,
  Chat,
  Edit,
  File,
  Login,
  Logout,
  Play,
  Search,
  Users,
} from './assets/icons';

type Type =
  | 'ARROW_BACK'
  | 'ARROW_FORWARD'
  | 'CHAT'
  | 'EDIT'
  | 'FILE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PLAY'
  | 'SEARCH'
  | 'USERS';

type SVGProps = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

type SVGComponent = React.FunctionComponent<SVGProps>;

const Icons: { [key in Type]: SVGComponent } = {
  ARROW_BACK: ArrowBack,
  ARROW_FORWARD: ArrowForward,
  CHAT: Chat,
  EDIT: Edit,
  FILE: File,
  LOGIN: Login,
  LOGOUT: Logout,
  PLAY: Play,
  SEARCH: Search,
  USERS: Users,
};

type Size = '24px' | '48px';

type IconProps = {
  type: Type;
  size?: Size | undefined;
  color?: Color | undefined;
};

export default function Icon({ type, color, size }: IconProps) {
  const IconComponent = Icons[type];
  return (
    <IconComponent
      style={{ color: `var(${color})` }}
      height={size}
      width={size}
    />
  );
}
