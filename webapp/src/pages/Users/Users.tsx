import './Users.css';
import {
  IconVariant,
  Input,
  InputVariant,
  NavigationBar,
  RowsList,
  RowsListProps,
  SmallAvatar,
} from '../../shared/components';
import React from 'react';
import { USER_URL, USERS_EP_URL, USERS_URL } from '../../shared/urls';
import { Link } from 'react-router-dom';

class User {
  username: string;
  email: string;
  avatarId: string | null;
  id: string;
  createdAt: Date;

  constructor(
    username: string,
    email: string,
    avatarId: string | null,
    id: string,
    createdAt: Date,
  ) {
    this.username = username;
    this.email = email;
    this.avatarId = avatarId;
    this.id = id;
    this.createdAt = createdAt;
  }
}

export default class Users extends React.Component<
  RowsListProps,
  RowsListProps
> {
  private wildcardAvatar = 'https://i.pravatar.cc/9000';

  private async getRows(url: string): Promise<RowsListProps> {
    let rows: RowsListProps = { rows: [] };
    const response = await fetch(url);
    const array: User[] = await response.json();
    if (array) {
      for (const user of array) {
        rows.rows?.push({
          iconVariant: IconVariant.ARROW_FORWARD,
          avatarProps: {
            url: user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
              : this.wildcardAvatar,
            status: 'offline',
          },
          onClick: () => {
            window.location.href = `${USERS_URL}/${user.username}`;
          },
          title: user.username,
          subtitle: 'level x',
          key: user.id,
        });
      }
    }
    return rows;
  }

  private async fetchUsersList() {
    const lRows: RowsListProps = await this.getRows(`${USERS_EP_URL}`);
    this.setState({ ...lRows });
  }

  constructor(props?: RowsListProps) {
    super(props ?? { rows: [] });
    this.state = { ...(props ?? { rows: [] }) };
  }

  componentDidMount() {
    this.fetchUsersList().catch((e) => console.error(e));
  }

  render(): JSX.Element {
    return (
      <div className="users">
        <div className="users-avatar">
          <Link to={USER_URL}>
            <SmallAvatar url={`${USERS_EP_URL}/avatar`} />
          </Link>
        </div>
        <div className="users-search">
          <Input
            iconVariant={IconVariant.SEARCH}
            variant={InputVariant.DARK}
            placeholder="search"
          />
        </div>
        <div className="users-rows">
          {this.state.rows && <RowsList rows={this.state.rows} />}
        </div>
        <div className="users-navigation">
          <NavigationBar />
        </div>
      </div>
    );
  }
}
