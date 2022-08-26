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
import { useData } from '../../shared/hooks/UseData';
import { goBack } from '../../shared/callbacks';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../shared/generated';
import { usersApi } from '../../shared/services/ApiService';
import { EditableAvatar } from '../../shared/components/Avatar/EditableAvatar';
import useDrag from '../../shared/hooks/UseDrag';

export const EDITABLE_AVATAR_SCALE = 0.6896;

export default function EditAvatarPage() {
  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );

  const { data: user } = useData<User>(getCurrentUser);

  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag({ x: user?.avatarX ?? 0, y: user?.avatarY ?? 0 });

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const submitChanges = useCallback(async () => {
    if (isFilePicked) {
      usersApi
        .userControllerUploadAvatar({ file: selectedFile })
        .catch((e) => console.error(e))
        .finally(() => setIsFilePicked(false));
    }
    usersApi
      .userControllerUpdateCurrentUserRaw({
        updateUserDto: {
          avatarX: Math.round(picturePosition.x * EDITABLE_AVATAR_SCALE),
          avatarY: Math.round(picturePosition.y * EDITABLE_AVATAR_SCALE),
        },
      })
      .catch((e) => console.error(e));
  }, [picturePosition, isFilePicked, selectedFile]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event &&
      event?.target &&
      event?.target?.files?.[0] &&
      setSelectedFile(event?.target?.files[0]);
    setIsFilePicked(true);
  };
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
        edit avatar
      </Header>
      <Row
        iconVariant={IconVariant.FILE}
        title="Select file"
        onChange={changeHandler}
      />
      <EditableAvatar
        url={
          user.avatarId
            ? `${USERS_EP_URL}/${user.id}/avatar`
            : WILDCARD_AVATAR_URL
        }
        picturePosition={picturePosition}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
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
