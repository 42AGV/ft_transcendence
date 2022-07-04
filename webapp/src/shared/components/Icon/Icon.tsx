import { Color } from '../../types';
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

export enum IconVariant {
  ARROW_BACK = 'ARROW_BACK',
  ARROW_FORWARD = 'ARROW_FORWARD',
  CHAT = 'CHAT',
  EDIT = 'EDIT',
  FILE = 'FILE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PLAY = 'PLAY',
  SEARCH = 'SEARCH',
  USERS = 'USERS',
}

type SVGProps = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

type SVGComponent = React.FunctionComponent<SVGProps>;

const Icons: { [key in IconVariant]: SVGComponent } = {
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

export enum IconSize {
  SMALL = '24px',
  LARGE = '48px',
}

type IconProps = {
  variant: IconVariant;
  size?: IconSize | undefined;
  color?: Color | undefined;
};

export default function Icon({ variant, color, size }: IconProps) {
  const IconTag = Icons[variant];
  return <IconTag className={color} height={size} width={size} />;
}
