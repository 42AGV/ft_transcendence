import './Users.css';
import {IconVariant, Input, InputVariant, NavigationBar, RowsList, SmallAvatar} from "../../shared/components";
import {buttonAction, rowsData} from "../ComponentsBook/ComponentsExamples/RowsListExample";

export default function Users() {
  const randomAvatar = 'https://i.pravatar.cc/9000';
  rowsData.push(  {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: { url: randomAvatar, status: 'offline' },
    onClick: buttonAction,
    title: 'John Sschmoe',
    subtitle: 'level 16',
    key: '11602486-0878-440c-9db1-a7006c19a39f',
  });
  rowsData.push(  {
    iconVariant: IconVariant.ARROW_FORWARD,
    avatarProps: { url: randomAvatar, status: 'playing' },
    onClick: buttonAction,
    title: 'Josh Roe',
    subtitle: 'level 16',
    key: '87012486-0878-440c-9db1-a7006c19a39f',
  });
  return (
    <div className="users">
      <div className="users-wrapper">
        <div className="fixed-frame">
          <div className="avatar-search">
            <SmallAvatar url={randomAvatar} />
            <Input
              iconVariant={IconVariant.SEARCH}
              variant={InputVariant.DARK}
              placeholder="search"
            />
          </div>
          <NavigationBar />
        </div>
        <div className="scrollable">
          <RowsList rows={rowsData} />
        </div>
      </div>
    </div>
  );
}
