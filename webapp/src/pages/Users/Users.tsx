import './Users.css';
import {IconVariant, Input, InputVariant, NavigationBar, RowsList, SmallAvatar} from "../../shared/components";
import {rowsData} from "../ComponentsBook/ComponentsExamples/RowsListExample";

export default function Users() {
  const randomAvatar = 'https://i.pravatar.cc/1000';
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
        <RowsList rows={rowsData} />
      </div>
    </div>
  );
}
