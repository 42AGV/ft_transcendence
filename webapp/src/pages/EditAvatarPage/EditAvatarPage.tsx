import './EditAvatarPage.css';
import {
  Button,
  ButtonVariant,
  EditableAvatar,
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
import { useDrag } from '../../shared/hooks/UseDrag';

export const EDITABLE_AVATAR_SCALE = 1.45;
export const EDITABLE_AVATAR_SCALE_REVERSE = 1 / EDITABLE_AVATAR_SCALE;

export default function EditAvatarPage() {
  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    [],
  );
  const [imgHash, setImgHash] = useState<number>(Date.now());

  const { data: user } = useData<User>(getCurrentUser);

  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag(user ? { x: user.avatarX, y: user.avatarY } : null);

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const submitPlacement = useCallback(async () => {
    usersApi
      .userControllerUpdateCurrentUserRaw({
        updateUserDto: {
          avatarX: Math.round(
            picturePosition.x * EDITABLE_AVATAR_SCALE_REVERSE,
          ),
          avatarY: Math.round(
            picturePosition.y * EDITABLE_AVATAR_SCALE_REVERSE,
          ),
        },
      })
      .catch((e) => console.error(e));
  }, [picturePosition]);

  const uploadAvatar = useCallback(async () => {
    if (selectedFile !== null) {
      usersApi
        .userControllerUploadAvatar({ file: selectedFile })
        .catch((e) => console.error(e))
        .finally(() => {
          setImgHash(Date.now());
          setSelectedFile(null);
        });
    }
  }, [selectedFile]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event &&
      event?.target &&
      event?.target?.files?.[0] &&
      setSelectedFile(event?.target?.files[0]);
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
        subtitle={selectedFile?.name ?? undefined}
        onChange={changeHandler}
      />
      <EditableAvatar
        url={
          user.avatarId
            ? `${USERS_EP_URL}/${user.id}/avatar`
            : WILDCARD_AVATAR_URL
        }
        imgHash={imgHash}
        picturePosition={picturePosition}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
      />
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={selectedFile !== null ? uploadAvatar : submitPlacement}
      >
        {selectedFile !== null ? 'Upload' : 'Save changes'}
      </Button>
    </div>
  );
}
