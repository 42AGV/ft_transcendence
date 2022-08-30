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
import { goBack } from '../../shared/callbacks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';
import { useDrag } from '../../shared/hooks/UseDrag';
import { useAuth } from '../../shared/hooks/UseAuth';

export const EDITABLE_AVATAR_SCALE = 1.29;
export const EDITABLE_AVATAR_SCALE_REVERSE = 1 / EDITABLE_AVATAR_SCALE;

type ImgData = {
  imgHash: string;
  imgName: string | null;
  imgFile: File | null;
};

export default function EditAvatarPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { picturePosition, handleMouseDown, handleMouseMove, handleMouseUp } =
    useDrag(user ? { x: user.avatarX, y: user.avatarY } : null);
  const [imgData, setImgData] = useState<ImgData>({
    imgHash: Date.now().toString(),
    imgName: null,
    imgFile: null,
  });

  const { imgName, imgHash, imgFile } = imgData;
  const submitPlacement = async () => {
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
  };

  const uploadAvatar = async () => {
    if (imgFile !== null) {
      usersApi
        .userControllerUploadAvatar({ file: imgFile })
        .catch((e) => console.error(e))
        .finally(() => {
          setImgData({
            imgName: null,
            imgHash: Date.now().toString(),
            imgFile: null,
          });
        });
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }
    setImgData({
      imgFile: event.target.files[0],
      imgName: event.target.files[0].name,
      imgHash: Date.now().toString(),
    });
  };

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
        title="Select file"
        subtitle={imgName ?? undefined}
        onChange={changeHandler}
      />
      <EditableAvatar
        url={
          user.avatarId
            ? `${USERS_EP_URL}/${user.id}/avatar`
            : WILDCARD_AVATAR_URL
        }
        imgHash={imgHash}
        XCoordinate={picturePosition.x}
        YCoordinate={picturePosition.y}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
      />
      <Button
        variant={ButtonVariant.SUBMIT}
        iconVariant={IconVariant.ARROW_FORWARD}
        onClick={imgFile !== null ? uploadAvatar : submitPlacement}
      >
        {imgFile !== null ? 'Upload' : 'Save changes'}
      </Button>
    </div>
  );
}
