import { ReactComponent as ArrowBack } from './assets/icons/arrow-back.svg';
import { ReactComponent as ArrowForward } from './assets/icons/arrow-forward.svg';
import { ReactComponent as Chat } from './assets/icons/chat.svg';
import { ReactComponent as Edit } from './assets/icons/edit.svg';
import { ReactComponent as File } from './assets/icons/file.svg';
import { ReactComponent as Login } from './assets/icons/login.svg';
import { ReactComponent as Logout } from './assets/icons/logout.svg';
import { ReactComponent as Play } from './assets/icons/play.svg';
import { ReactComponent as Search } from './assets/icons/search.svg';
import { ReactComponent as Users } from './assets/icons/users.svg';

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

type Size = '24px' | '48px' | undefined;

type Color =
  | '--color-warning'
  | '--color-submit'
  | '--color-online'
  | '--color-offline'
  | '--color-light'
  | '--color-background'
  | '--color-dark'
  | undefined;

interface IconProps {
  type: Type;
  size?: Size;
  color?: Color;
}

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
