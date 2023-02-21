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
import { useAuth } from '../../shared/hooks/UseAuth';
import { handleRequestError } from '../../shared/utils/HandleRequestError';

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
      const { level, isLocal, gOwner, gAdmin, gBanned } =
        await authApi.authControllerRetrieveAuthUserWithRoles();
      setAuthUser({ ...authUser, level, isLocal, gOwner, gAdmin, gBanned });
      navigate(DEFAULT_LOGIN_REDIRECT_URL, { replace: true });
    } catch (error: unknown) {
      handleRequestError(error, 'Could not validate 2FA', warn);
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
