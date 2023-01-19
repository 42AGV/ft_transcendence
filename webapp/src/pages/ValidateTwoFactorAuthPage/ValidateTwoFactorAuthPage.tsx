import './ValidateTwoFactorAuthPage.css';
import { useState } from 'react';
import {
  Button,
  ButtonVariant,
  Header,
  IconVariant,
  Input,
  InputVariant,
} from '../../shared/components';
import { DEFAULT_LOGIN_REDIRECT_URL } from '../../shared/urls';
import { useNavigation } from '../../shared/hooks/UseNavigation';
import { authApi } from '../../shared/services/ApiService';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { ResponseError } from '../../shared/generated';
import { useAuth } from '../../shared/hooks/UseAuth';

export default function ValidateTwoFactorAuthPage() {
  const { goBack } = useNavigation();
  const [code, setCode] = useState('');
  const { warn } = useNotificationContext();
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    try {
      const authUser =
        await authApi.authControllerValidateTwoFactorAuthentication({
          twoFactorAuthenticationCodeDto: { code },
        });
      const { gOwner, gAdmin, gBanned } =
        await authApi.authControllerRetrieveAuthUserWithRoles();
      setAuthUser({ ...authUser, gOwner, gAdmin, gBanned });
      navigate(DEFAULT_LOGIN_REDIRECT_URL, { replace: true });
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
        warn('Could not validate 2FA');
      }
    }
  };

  return (
    <div className="validate-two-factor-auth-page">
      <Header icon={IconVariant.ARROW_BACK} onClick={goBack}>
        validate 2fa
      </Header>
      <form
        className="validate-two-factor-auth-page-form"
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
  );
}
