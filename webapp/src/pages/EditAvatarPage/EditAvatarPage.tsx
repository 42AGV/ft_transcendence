import './EditAvatarPage.css';
import {
  Button,
  ButtonVariant,
  EditableAvatar,
  Header,
  IconVariant,
  Loading,
  Text,
  TextVariant,
  TextColor,
  Row,
} from '../../shared/components';
import { AVATAR_EP_URL, WILDCARD_AVATAR_URL } from '../../shared/urls';
import { SubmitStatus } from '../../shared/types';
import { goBack } from '../../shared/callbacks';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../shared/services/ApiService';
import { useDrag } from '../../shared/hooks/UseDrag';
import { useData } from '../../shared/hooks/UseData';
import {
  EDITABLE_AVATAR_SCALE,
  EDITABLE_AVATAR_SCALE_REVERSE,
} from '../../shared/components/Avatar/EditableAvatar';

type ImgData = {
  imgName: string | null;
  imgFile: File | null;
};

export default function EditAvatarPage() {
  const [status, setStatus] = useState<SubmitStatus>({
    type: 'pending',
    message: '',
  });
  const [imgData, setImgData] = useState<ImgData>({
    imgName: null,
    imgFile: null,
  });
  const getCurrentUser = useCallback(
    () => usersApi.userControllerGetCurrentUser(),
    // eslint-disable-next-line
    [imgData],
  );
  const { data: user } = useData(getCurrentUser);
  const navigate = useNavigate();
  const reverseTransform = useCallback(
    (value: number) => -value * EDITABLE_AVATAR_SCALE,
    [],
  );
  const { picturePosition, handleDown, handleMove, handleUp } = useDrag({
    startingPosition: user ? { x: user.avatarX, y: user.avatarY } : null,
    reverseTransform,
  });

  const { imgName, imgFile } = imgData;
  const FormatNumber = (value: number) =>
    Math.round(value * EDITABLE_AVATAR_SCALE_REVERSE);
  const submitPlacement = async () => {
    usersApi
      .userControllerUpdateCurrentUserRaw({
        updateUserDto: {
          avatarX: FormatNumber(picturePosition.x),
          avatarY: FormatNumber(picturePosition.y),
        },
      })
      .then(() =>
        setStatus({
          type: 'success',
          message: 'Image settings saved correctly.',
        }),
      )
      .catch((e) =>
        setStatus({ type: 'error', message: e.response.statusText }),
      );
  };

  const uploadAvatar = async () => {
    if (imgFile !== null) {
      usersApi
        .userControllerUploadAvatar({ file: imgFile })
        .then(() =>
          setStatus({ type: 'success', message: 'Image uploaded correctly.' }),
        )
        .catch((e) =>
          setStatus({ type: 'error', message: e.response.statusText }),
        )
        .finally(() => {
          setImgData({
            imgName: null,
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
    });
  };

  return user === null ? (
    <div className="edit-avatar-page">
      <div className="edit-avatar-loading">
        <Loading />
      </div>
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
            ? `${AVATAR_EP_URL}/${user.avatarId}`
            : WILDCARD_AVATAR_URL
        }
        XCoordinate={picturePosition.x}
        YCoordinate={picturePosition.y}
        handleDown={handleDown}
        handleUp={handleUp}
        handleMove={handleMove}
      />
      {status.type !== 'pending' && (
        <Text
          variant={TextVariant.PARAGRAPH}
          color={
            status.type === 'success' ? TextColor.ONLINE : TextColor.OFFLINE
          }
        >
          {status.message}
        </Text>
      )}
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
