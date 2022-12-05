import './EditAvatarPageTemplate.css';
import {
  Button,
  ButtonVariant,
  EditableAvatar,
  Header,
  IconVariant,
  Loading,
  Row,
} from '../..';
import React, { useCallback, useState } from 'react';
import { useDrag } from '../../../hooks/UseDrag';
import {
  EDITABLE_AVATAR_SCALE,
  EDITABLE_AVATAR_SCALE_REVERSE,
} from '../../../components/Avatar/EditableAvatar';
import { useNavigation } from '../../../hooks/UseNavigation';
import { useNotificationContext } from '../../../context/NotificationContext';
import NotFoundPage from '../../../../pages/NotFoundPage/NotFoundPage';
import { Avatar } from '../../../types';

type ImgData = {
  imgName: string | null;
  imgFile: File | null;
  imgSrc: string;
};

type EditAvatarProps<T extends Avatar> = {
  isLoading: boolean;
  model: T | null;
  avatarUrl: string;
  submitPlacement: (avatarX: number, avatarY: number) => Promise<void>;
  uploadAvatar: (file: File | null) => Promise<void>;
};

export default function EditAvatarPage<T extends Avatar>({
  isLoading,
  model,
  avatarUrl,
  submitPlacement,
  uploadAvatar,
}: EditAvatarProps<T>) {
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
    startingPosition: model ? { x: model.avatarX, y: model.avatarY } : null,
    reverseTransform,
  });

  const { imgName, imgFile } = imgData;
  const FormatNumber = (value: number) =>
    Math.round(value * EDITABLE_AVATAR_SCALE_REVERSE);
  const avatarX = FormatNumber(picturePosition.x);
  const avatarY = FormatNumber(picturePosition.y);

  const handleSubmitPlacement = async () => {
    submitPlacement(avatarX, avatarY)
      .then(() => notify('Image visible area saved correctly.'))
      .catch((e) => warn(e.response.statusText));
  };

  const handleUploadAvatar = async () => {
    uploadAvatar(imgFile)
      .then(() => notify('Image uploaded correctly.'))
      .catch((e) => warn(e.response.statusText))
      .finally(() => {
        setImgData({
          imgName: null,
          imgFile: null,
          imgSrc: '',
        });
      });
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

  if (isLoading) {
    return (
      <div className="edit-avatar-page">
        <div className="edit-avatar-loading">
          <Loading />
        </div>
      </div>
    );
  }

  if (!model) {
    return <NotFoundPage />;
  }

  return (
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
        url={imgData.imgSrc || avatarUrl}
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
        onClick={imgFile !== null ? handleUploadAvatar : handleSubmitPlacement}
      >
        {imgFile !== null ? 'Upload' : 'Save changes'}
      </Button>
    </div>
  );
}
