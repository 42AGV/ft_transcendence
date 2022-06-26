import { ReactComponent as IconArrowBack } from './icons/arrow-back.svg';
import { ReactComponent as IconArrowForward } from './icons/arrow-forward.svg';
import { ReactComponent as IconChat } from './icons/chat.svg';
import { ReactComponent as IconEdit } from './icons/edit.svg';
import { ReactComponent as IconFile } from './icons/file.svg';
import { ReactComponent as IconLogin } from './icons/login.svg';
import { ReactComponent as IconLogout } from './icons/logout.svg';
import { ReactComponent as IconPlay } from './icons/play.svg';
import { ReactComponent as IconSearch } from './icons/search.svg';
import { ReactComponent as IconUsers } from './icons/users.svg';

export enum IconType {
  ARROW_BACK = 'arrowBack',
  ARROW_FORWARD = 'arrowForward',
  CHAT = 'chat',
  EDIT = 'edit',
  FILE = 'file',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PLAY = 'play',
  SEARCH = 'search',
  USERS = 'users',
}

type SVGPropsType = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined;
};

type IconComponentType = React.FunctionComponent<SVGPropsType>;

const Icons: { [key in IconType]: IconComponentType } = {
  arrowBack: IconArrowBack,
  arrowForward: IconArrowForward,
  chat: IconChat,
  edit: IconEdit,
  file: IconFile,
  login: IconLogin,
  logout: IconLogout,
  play: IconPlay,
  search: IconSearch,
  users: IconUsers,
};

type IconPropsType = {
  type: IconType;
  color?: string | undefined;
  size?: number | string | undefined;
  className?: string | undefined;
  title?: string | undefined;
};

export function Icon({ type, size, ...restProps }: IconPropsType) {
  const IconComponent = Icons[type];
  return <IconComponent height={size} width={size} {...restProps} />;
}
