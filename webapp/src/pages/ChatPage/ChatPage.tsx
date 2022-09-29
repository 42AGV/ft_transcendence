import io from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';
import {
  ChatBubble,
  ChatBubbleVariant,
  IconVariant,
  MediumAvatar,
  NavigationBar,
  RowItem,
  RowsList,
  SearchForm,
} from '../../shared/components';
import { USER_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import './chatPage.css';
import { Link } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';

const socket = io('localhost:3000/api');
type SearchFetchFnParams = {
  search: string;
  offset: number;
};
export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  const [searchParams, setSearchParams] = useState<SearchFetchFnParams>({
    search: '',
    offset: 0,
  });
  const { search } = searchParams;
  const sendMessage = () => {
    socket.emit('send_message', { message });
  };

  useEffect(() => {
    socket.on('new_message', (data: any) => {
      setMessageReceived(data.message);
    });
  }, [socket]);
  const randomAvatar = WILDCARD_AVATAR_URL;
  const buttonAction = (): void => alert('This is an alert');
  const rowsData: RowItem[] = [
    {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: { url: randomAvatar, status: 'online' },
      onClick: buttonAction,
      title: 'John Doe',
      subtitle: 'level 3',
      key: '75442486-0878-440c-9db1-a7006c25a39f',
    },
    {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: { url: randomAvatar, status: 'offline' },
      onClick: buttonAction,
      title: 'Jane Doe',
      subtitle: 'level 99',
      key: '99a46451-975e-4d08-a697-9fa9c15f47a6',
    },
    {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: { url: randomAvatar, status: 'playing' },
      onClick: buttonAction,
      title: 'Joe Shmoe',
      subtitle: 'level 0',
      key: '5c2013ba-45a0-45b9-b65e-750757df21a0',
    },
  ];
  const handleSearch = (value: string) => {
    setSearchParams({ search: value, offset: 0 });
  };
  return (
    <div className="chat-page">
      <div className="dispatch-page-avatar">
        <Link to={USER_URL}>
          <MediumAvatar url={WILDCARD_AVATAR_URL} />
        </Link>
      </div>
      <div className="dispatch-page-search">
        <SearchForm search={search} onSearchChange={handleSearch} />
      </div>
      <div className="dispatch-page-navigation">
        <NavigationBar />
      </div>
      <div className="chat-page-chats">
        <RowsList rows={rowsData} />
      </div>
      <div className="chat-page-input-message">
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={sendMessage}> Send Message</button>
      </div>
      <div className="chat-page-messages">
        <ChatBubble
          text={messageReceived}
          variant={ChatBubbleVariant.OTHER}
        ></ChatBubble>
      </div>
    </div>
  );
}
