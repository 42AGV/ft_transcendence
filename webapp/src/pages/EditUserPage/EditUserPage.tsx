import './EditUserPage.css';
import {
  Button,
  ButtonVariant,
  EditUserForm,
  Header,
  IconVariant,
  LargeAvatar,
  Row,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { USER_URL, USERS_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { goBack, logout } from '../../shared/callbacks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instanceOfUser, User } from '../../shared/generated';

export default function EditUserPage() {
  // const param = useParams();
  // const [user, setUser] = useState<User | null>(null);
  // const result: User | null = useData<User>(
  //   isMe ? `${USERS_EP_URL}/me` : `${USERS_EP_URL}/${param.id}`,
  // );
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (result && instanceOfUser(result)) {
  //     setUser(result);
  //   }
  // }, [result]);
  const user = {
    id: 'cdb63720-9628-5ef6-bbca-2e5ce6094f3c',
    createdAt: new Date(Date.now()),
    avatarId: null,
    username: 'aollero',
    email: 'aollero@student.42madrid.com',
  };
  return user === null ? (
    <div className="edit-user-page">
      <Text variant={TextVariant.SUBHEADING} weight={TextWeight.MEDIUM}>
        Loading...
      </Text>
    </div>
  ) : (
    <div className="edit-user-page">
      <Header
        navigationFigure={IconVariant.ARROW_BACK}
        onClick={goBack(navigate)}
      >
        edit profile
      </Header>
      <div className="avatar-large">
        <LargeAvatar
          url={
            user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
              : WILDCARD_AVATAR_URL
          }
          edit={true}
        />
      </div>
      <div className="form-container">
        <EditUserForm />
      </div>
    </div>
  );
}
