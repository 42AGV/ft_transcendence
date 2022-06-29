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

export enum IconType {
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

const Icons: { [key in IconType]: SVGComponent } = {
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
  type: IconType;
  size?: IconSize | undefined;
  color?: Color | undefined;
};

export default function Icon({ type, color, size }: IconProps) {
  const NameTag = Icons[type];
  return (
    <NameTag style={{ color: `var(${color})` }} height={size} width={size} />
  );
}
