import './EditAvatarPage.css';
import {
  Button,
  ButtonVariant,
  EditableAvatar,
  Header,
  IconVariant,
  Loading,
  Row,
} from '../../shared/components';
import { AVATAR_EP_URL } from '../../shared/urls';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';
import { useDrag } from '../../shared/hooks/UseDrag';
import { useAuth } from '../../shared/hooks/UseAuth';
import {
  EDITABLE_AVATAR_SCALE,
  EDITABLE_AVATAR_SCALE_REVERSE,
} from '../../shared/components/Avatar/EditableAvatar';
import { AvatarResponseDto } from '../../shared/generated';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { useNotificationContext } from '../../shared/context/NotificationContext';

type ImgData = {
  imgName: string | null;
  imgFile: File | null;
  imgSrc: string;
};

export default function EditAvatarPage() {
  const { username } = useParams();
  const { authUser, setAuthUser } = useAuth(username);
  const { goBack } = useNavigation();
  const [imgData, setImgData] = useState<ImgData>({
    imgName: null,
    imgFile: null,
    imgSrc: '',
  });
  const { notify, warn } = useNotificationContext();
  const reverseTransform = useCallback(
    (value: number) => -value * EDITABLE_AVATAR_SCALE,
    [],
  );
  const { picturePosition, handleDown, handleMove, handleUp } = useDrag({
    startingPosition: authUser
      ? { x: authUser.avatarX, y: authUser.avatarY }
      : null,
    reverseTransform,
  });

  const { imgName, imgFile } = imgData;
  const FormatNumber = (value: number) =>
    Math.round(value * EDITABLE_AVATAR_SCALE_REVERSE);
  const avatarX = FormatNumber(picturePosition.x);
  const avatarY = FormatNumber(picturePosition.y);
  const submitPlacement = async () => {
    usersApi
      .userControllerUpdateCurrentUserRaw({
        updateUserDto: {
          avatarX,
          avatarY,
        },
      })
      .then(() => {
        notify('Image visible area saved correctly.');
        setAuthUser((prevState) => {
          if (!prevState) return null;
          return { ...prevState, avatarX, avatarY };
        });
      })
      .catch((e) => warn(e.response.statusText));
  };

  const uploadAvatar = async () => {
    if (imgFile !== null) {
      usersApi
        .userControllerUploadAvatar({ file: imgFile })
        .then((res: AvatarResponseDto) => {
          notify('Image uploaded correctly.');
          setAuthUser((prevState) => {
            if (!prevState) return null;
            const { avatarId } = res;
            return { ...prevState, avatarId };
          });
        })
        .catch((e) => warn(e.response.statusText))
        .finally(() => {
          setImgData({
            imgName: null,
            imgFile: null,
            imgSrc: '',
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
      imgSrc: URL.createObjectURL(event.target.files[0]),
    });
  };

  return authUser === null ? (
    <div className="edit-avatar-page">
      <div className="edit-avatar-loading">
        <Loading />
      </div>
    </div>
  ) : (
    <div className="edit-avatar-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        edit avatar
      </Header>
      <Row
        iconVariant={IconVariant.FILE}
        title="Select file"
        subtitle={imgName ?? undefined}
        onChange={changeHandler}
      />
      <EditableAvatar
        url={imgData.imgSrc || `${AVATAR_EP_URL}/${authUser.avatarId}`}
        XCoordinate={picturePosition.x}
        YCoordinate={picturePosition.y}
        handleDown={handleDown}
        handleUp={handleUp}
        handleMove={handleMove}
        disabled={imgFile !== null}
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
