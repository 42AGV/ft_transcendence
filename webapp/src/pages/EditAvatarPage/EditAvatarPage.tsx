import './EditAvatarPage.css';
import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Row,
  Text,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { USERS_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { goBack } from '../../shared/callbacks';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditableAvatar } from '../../shared/components/Avatar/EditableAvatar';
import { useAuth } from '../../shared/hooks/UseAuth';

export default function EditAvatarPage() {
  const submitChanges = useCallback(() => true, []);
  const { user } = useAuth();
  const navigate = useNavigate();

  return user === null ? (
    <div className="edit-avatar-page">
      <Text variant={TextVariant.SUBHEADING} weight={TextWeight.MEDIUM}>
        Loading...
      </Text>
    </div>
  ) : (
    <div className="edit-avatar-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack(navigate)}>
        edit avatar
      </Header>
      <Row
        iconVariant={IconVariant.FILE}
        onClick={submitChanges}
        title="Select file"
      />
      <EditableAvatar
        url={
          user.avatarId
            ? `${USERS_EP_URL}/${user.id}/avatar`
            : WILDCARD_AVATAR_URL
        }
        picturePosition={{ x: 0, y: 0 }}
      />
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={submitChanges}
      >
        Upload
      </Button>
    </div>
  );
}
