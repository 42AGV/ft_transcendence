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

type IconType =
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

type IconProps = Pick<SVGProps, 'color' | 'className' | 'title'> & {
  type: IconType;
  size?: SVGProps['width'];
};

export default function Icon({ type, size, ...restProps }: IconProps) {
  const IconComponent = Icons[type];
  return <IconComponent height={size} width={size} {...restProps} />;
}
