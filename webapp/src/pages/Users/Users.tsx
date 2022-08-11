import './Users.css';
import {
  IconVariant,
  Input,
  InputVariant,
  NavigationBar,
  RowItem,
  RowsList,
  RowsListProps,
  SmallAvatar,
} from '../../shared/components';
import { buttonAction } from '../ComponentsBook/ComponentsExamples/RowsListExample';
import React from 'react';

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
  private usersApiEndpoint = 'http://localhost:3000/api/v1/users';
  private async getRows(url: string): Promise<RowsListProps> {
    let rows: RowsListProps = { rows: [] };
    try {
      const response = await fetch(url);
      const array: User[] = await response.json();
      if (array) {
        for (const user of array) {
          const item: RowItem = {
            iconVariant: IconVariant.ARROW_FORWARD,
            avatarProps: {
              url: user.avatarId
                ? `${this.usersApiEndpoint}/${user.id}/avatar`
                : this.wildcardAvatar,
              status: 'offline',
            },
            onClick: buttonAction,
            title: user.username,
            subtitle: 'level x',
            key: user.id,
          };
          rows.rows?.push(item);
        }
      }
    } catch (error) {
      console.error(error);
    }
    return rows;
  }

  constructor(props?: RowsListProps) {
    super(props ?? { rows: [] });
    this.state = { ...props };
  }

  componentDidMount() {
    const fetchUsersList = async () => {
      const lRows: RowsListProps = await this.getRows(
        `${this.usersApiEndpoint}`,
      );
      this.setState({ ...lRows });
    };
    fetchUsersList();
  }

  render(): JSX.Element {
    return (
      <div className="users">
        <div className="users-avatar">
          <SmallAvatar url={`${this.usersApiEndpoint}/avatar`} />
        </div>
        <div className="users-search">
          <Input
            iconVariant={IconVariant.SEARCH}
            variant={InputVariant.DARK}
            placeholder="search"
          />
        </div>
        <div className="users-rows">
          <RowsList rows={this.state.rows} />
        </div>
        <div className="users-navigation">
          <NavigationBar />
        </div>
      </div>
    );
  }
}
