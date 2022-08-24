import './EditAvatarPage.css';
import {
  EditUserForm,
  Header,
  IconVariant,
  LargeAvatar,
  Text,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import {
  EDIT_AVATAR_URL,
  USERS_EP_URL,
  WILDCARD_AVATAR_URL,
} from '../../shared/urls';
import { useData } from '../../shared/hooks/UseData';
import { goBack } from '../../shared/callbacks';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instanceOfUser, User } from '../../shared/generated';
import { usersApi } from '../../shared/services/ApiService';

export default function EditAvatarPage() {
  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const [user, setUser] = useState<User | null>(null);
  const { data } = useData<User>(getCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && instanceOfUser(data)) {
      setUser(data);
    }
  }, [data]);

  return user === null ? (
    <div className="edit-avatar-page">
      <Text variant={TextVariant.SUBHEADING} weight={TextWeight.MEDIUM}>
        Loading...
      </Text>
    </div>
  ) : (
    <div className="edit-avatar-page">
      <Header
        navigationFigure={IconVariant.ARROW_BACK}
        onClick={goBack(navigate)}
      >
        edit profile
      </Header>
      <div className="edit-avatar">
        <LargeAvatar
          url={
            user.avatarId
              ? `${USERS_EP_URL}/${user.id}/avatar`
              : WILDCARD_AVATAR_URL
          }
          edit={true}
          editUrl={EDIT_AVATAR_URL}
        />
      </div>
      <EditUserForm origFullName={user.fullName} origEmail={user.email} />
    </div>
  );
}
