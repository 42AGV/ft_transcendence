import { ReactComponent as ArrowBack } from './icons/arrow-back.svg';
import { ReactComponent as ArrowForward } from './icons/arrow-forward.svg';
import { ReactComponent as Chat } from './icons/chat.svg';
import { ReactComponent as Edit } from './icons/edit.svg';
import { ReactComponent as File } from './icons/file.svg';
import { ReactComponent as Login } from './icons/login.svg';
import { ReactComponent as Logout } from './icons/logout.svg';
import { ReactComponent as Play } from './icons/play.svg';
import { ReactComponent as Search } from './icons/search.svg';
import { ReactComponent as Users } from './icons/users.svg';

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
