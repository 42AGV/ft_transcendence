import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import {
  Button,
  ButtonVariant,
  ChatBubble,
  ChatBubbleVariant,
  IconVariant,
  Input,
  InputVariant,
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
  messageId: string;
  message: string;
  userId: string;
};
export default function ChatPage() {
  const [room, setroom] = useState('');
  const [message, setMessage] = useState('');
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
      console.log({ message, room, myId });
    }
  };
  useEffect(() => {
    socket.on('new_message', (data: Message) => {
      setMessagesReceived([...messagesReceived, data]);
    });
  }, [messagesReceived, myId]);
  const randomAvatar = WILDCARD_AVATAR_URL;
  const buttonAction1 = () => {
    if (room !== '') {
      socket.emit('leave_room', room);
    }
    setroom('1');
    socket.emit('join_room', room);
  };
  const buttonAction2 = () => {
    if (room !== '') {
      socket.emit('leave_room', room);
    }
    setroom('2');
    socket.emit('join_room', room);
  };
  const buttonAction3 = () => {
    if (room !== '') {
      socket.emit('leave_room', room);
    }
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
        <Input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          iconVariant={IconVariant.ARROW_FORWARD}
          variant={InputVariant.DARK}
        />
        <Button
          children="Send Message"
          variant={ButtonVariant.SUBMIT}
          onClick={sendMessage}
        />
      </div>
      <div className="chat-page-messages">
        {messagesReceived.map((item, index) =>
          item.userId === myId ? (
            <li key={index}>
              <ChatBubble
                text={item.message}
                variant={ChatBubbleVariant.SELF}
                avatar={
                  index === 0
                    ? { url: randomAvatar }
                    : messagesReceived[index].userId ===
                      messagesReceived[index - 1].userId
                    ? { url: '' }
                    : { url: randomAvatar }
                }
              ></ChatBubble>
            </li>
          ) : (
            <li key={index}>
              <ChatBubble
                text={item.message}
                variant={ChatBubbleVariant.OTHER}
                avatar={
                  index === 0
                    ? { url: randomAvatar }
                    : messagesReceived[index].userId ===
                      messagesReceived[index - 1].userId
                    ? { url: '' }
                    : { url: randomAvatar }
                }
              ></ChatBubble>
            </li>
          ),
        )}
      </div>
      <h1 className="room">Room: {room}</h1>
    </div>
  );
}
