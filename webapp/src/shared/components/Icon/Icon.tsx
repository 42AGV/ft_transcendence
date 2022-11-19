import { Color } from '../../types';
import {
  Add,
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
  Send,
  Remove,
} from './assets/icons';

export enum IconVariant {
  ADD = 'ADD',
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
  SEND = 'SEND',
  REMOVE = 'REMOVE',
}

type SVGProps = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

type SVGComponent = React.FunctionComponent<SVGProps>;

const Icons: { [key in IconVariant]: SVGComponent } = {
  ADD: Add,
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
  SEND: Send,
  REMOVE: Remove,
};

export enum IconSize {
  SMALL = '1.25rem',
  LARGE = '1.5rem',
}

type IconProps = {
  variant: IconVariant;
  size?: IconSize | undefined;
  color?: Color | undefined;
};

export default function Icon({ variant, color, size }: IconProps) {
  const IconTag = Icons[variant];
  return <IconTag className={color} style={{ width: size, height: size }} />;
}
