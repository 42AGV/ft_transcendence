import './EditUserPage.css';
import {
  EditUserForm,
  Header,
  IconVariant,
  LargeAvatar,
  Text,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { USERS_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { goBack } from '../../shared/callbacks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instanceOfUser, User } from '../../shared/generated';

export default function EditUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const result: User | null = useData<User>(`${USERS_EP_URL}/me`);
  const navigate = useNavigate();

  useEffect(() => {
    if (result && instanceOfUser(result)) {
      setUser(result);
    }
  }, [result]);

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
      <div className="edit-user-avatar">
        <LargeAvatar
          url={
            user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
              : WILDCARD_AVATAR_URL
          }
          edit={true}
        />
      </div>
      <EditUserForm origFullName={user.fullName} origEmail={user.email} />
    </div>
  );
}
