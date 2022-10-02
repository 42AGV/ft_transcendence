import io from 'socket.io-client';
import { useEffect, useState } from 'react';
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
import { useAuth } from '../../shared/hooks/UseAuth';

const socket = io('localhost:3000/api');
type SearchFetchFnParams = {
  search: string;
  offset: number;
};
type Message = {
  message: string;
  userId: string;
};
export default function ChatPage() {
  const [room, setroom] = useState('');
  const [message, setMessage] = useState('');
  const [myMessage, setMyMessage] = useState(false);
  const [messagesReceived, setMessagesReceived] = useState<Message[]>([]);
  const [searchParams, setSearchParams] = useState<SearchFetchFnParams>({
    search: '',
    offset: 0,
  });
  const { search } = searchParams;
  const { me } = useAuth();
  const myId = me?.id;
  const sendMessage = () => {
    if (myId) {
      socket.emit('send_message', { message, room, myId });
    }
  };

  useEffect(() => {
    socket.on('new_message', (data: Message) => {
      setMessagesReceived([...messagesReceived, data]);
      data.userId === myId ? setMyMessage(true) : setMyMessage(false);
    });
  }, [messagesReceived, myId]);
  const randomAvatar = WILDCARD_AVATAR_URL;
  const buttonAction1 = () => {
    setroom('1');
    socket.emit('join_room', room);
  };
  const buttonAction2 = () => {
    setroom('2');
    socket.emit('join_room', room);
  };
  const buttonAction3 = () => {
    setroom('3');
    socket.emit('join_room', room);
  };
  const rowsData: RowItem[] = [
    {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: { url: randomAvatar, status: 'online' },
      onClick: buttonAction1,
      title: 'John Doe',
      subtitle: 'level 3',
      key: '75442486-0878-440c-9db1-a7006c25a39f',
    },
    {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: { url: randomAvatar, status: 'offline' },
      onClick: buttonAction2,
      title: 'Jane Doe',
      subtitle: 'level 99',
      key: '99a46451-975e-4d08-a697-9fa9c15f47a6',
    },
    {
      iconVariant: IconVariant.ARROW_FORWARD,
      avatarProps: { url: randomAvatar, status: 'playing' },
      onClick: buttonAction3,
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
        {messagesReceived.map((item) =>
          myMessage ? (
            <ChatBubble
              text={item.message}
              variant={ChatBubbleVariant.SELF}
            ></ChatBubble>
          ) : (
            <ChatBubble
              text={item.message}
              variant={ChatBubbleVariant.OTHER}
            ></ChatBubble>
          ),
        )}
      </div>
      <h1 className="room">Room: {room}</h1>
    </div>
  );
}
