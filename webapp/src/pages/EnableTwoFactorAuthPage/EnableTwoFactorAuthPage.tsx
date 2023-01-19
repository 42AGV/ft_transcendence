import './EnableTwoFactorAuthPage.css';
import { useState } from 'react';
import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Input,
  InputVariant,
  Loading,
} from '../../shared/components';
import { useAuth } from '../../shared/hooks/UseAuth';
import { TWO_FACTOR_AUTH_QR_EP_URL, USER_ME_URL } from '../../shared/urls';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { authApi } from '../../shared/services/ApiService';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { ResponseError } from '../../shared/generated';

export default function EnableTwoFactorAuthPage() {
  const { authUser, setAuthUser, isLoading } = useAuth();
  const { goBack } = useNavigation();
  const [code, setCode] = useState('');
  const { warn, notify } = useNotificationContext();
  const navigate = useNavigate();
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (!authUser) {
      return;
    }
    try {
      await authApi.authControllerEnableTwoFactorAuthentication({
        twoFactorAuthenticationCodeDto: { code },
      });
      setAuthUser({ ...authUser, isTwoFactorAuthenticationEnabled: true });
      notify('You enabled 2FA');
      navigate(USER_ME_URL, { replace: true });
    } catch (error: unknown) {
      if (error instanceof ResponseError) {
        const responseBody = await error.response.json();
        if (responseBody.message) {
          warn(responseBody.message);
        } else {
          warn(error.response.statusText);
        }
      } else if (error instanceof Error) {
        warn(error.message);
      } else {
        warn('Could not enable 2FA');
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!authUser || authUser.isTwoFactorAuthenticationEnabled) {
    return <NotFoundPage />;
  }

  return (
    <div className="enable-two-factor-auth-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        enable 2fa
      </Header>
      <div className="enable-two-factor-auth-page-main">
        <img
          className="enable-two-factor-auth-page-qrcode"
          src={TWO_FACTOR_AUTH_QR_EP_URL}
          alt="QR Code"
        />
        <form
          className="enable-two-factor-auth-page-form"
          onSubmit={handleSubmit}
        >
          <Input
            variant={InputVariant.LIGHT}
            placeholder="TOTP code"
            onChange={(event) => setCode(event.target.value)}
            value={code}
          />
          <Button variant={ButtonVariant.SUBMIT}>Submit</Button>
        </form>
      </div>
    </div>
  );
}
