import { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  IconVariant,
  Input,
  InputVariant,
  Text,
  TextColor,
  TextVariant,
  TextWeight,
} from '../../shared/components';
import { ResponseError } from '../../shared/generated';
import { authApi } from '../../shared/services/ApiService';
import {
  DEFAULT_LOGIN_REDIRECT_URL,
  LOGIN_EP_URL,
  REGISTER_URL,
  HOST_URL,
  TWO_FACTOR_AUTH_VALIDATE_URL,
} from '../../shared/urls';
import './LoginPage.css';
import { useAuth } from '../../shared/hooks/UseAuth';
import { useNotificationContext } from '../../shared/context/NotificationContext';
import { handleRequestError } from '../../shared/utils/HandleRequestError';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setAuthUser } = useAuth();
  const { warn } = useNotificationContext();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to={DEFAULT_LOGIN_REDIRECT_URL} replace />;
  }
  async function login() {
    try {
      const authUser = await authApi.authControllerLoginLocalUser({
        loginUserDto: { username, password },
      });
      if (authUser.isTwoFactorAuthenticationEnabled) {
        navigate(TWO_FACTOR_AUTH_VALIDATE_URL, { replace: true });
      } else {
        const { gOwner, gAdmin, gBanned } =
          await authApi.authControllerRetrieveAuthUserWithRoles();
        setAuthUser({ ...authUser, gOwner, gAdmin, gBanned });
        navigate(DEFAULT_LOGIN_REDIRECT_URL, { replace: true });
      }
    } catch (error) {
      let errMessage = '';
      if (error instanceof ResponseError) {
        if (error.response.status === 403 || error.response.status === 401) {
          errMessage = 'Incorrect username or password';
        } else {
          errMessage = `${error.response.statusText}`;
        }
      } else if (error instanceof Error) {
        errMessage = `${error.message}`;
      }
      warn(errMessage);
    }
  }
  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login().catch((e) => handleRequestError(e, 'Could not log in', warn));
  };

  return (
    <div className="login">
      <Link className="login-title" to={HOST_URL}>
        <Text
          variant={TextVariant.TITLE}
          color={TextColor.GAME}
          weight={TextWeight.BOLD}
        >
          PONG
        </Text>
      </Link>
      <div className="landing-animation">
        <div className="landing-animation-ping"></div>
        <div className="landing-animation-pong"></div>
        <div className="landing-animation-ball"></div>
      </div>
      <div className="login-container">
        <Button
          variant={ButtonVariant.SUBMIT}
          onClick={() => window.location.replace(LOGIN_EP_URL)}
        >
          Login with 42
        </Button>
        <div className="login-container__separator">
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.BOLD}
          >
            or
          </Text>
        </div>
        <form id="login-form" className="login-form" onSubmit={handleOnSubmit}>
          <Input
            variant={InputVariant.LIGHT}
            placeholder="username"
            value={username}
            name="username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <Input
            variant={InputVariant.LIGHT}
            placeholder="password"
            value={password}
            name="password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </form>
        <Button
          form="login-form"
          variant={ButtonVariant.SUBMIT}
          iconVariant={IconVariant.LOGIN}
          children="Login"
        />
        <div className="final-text">
          <Text
            variant={TextVariant.SUBHEADING}
            color={TextColor.LIGHT}
            weight={TextWeight.REGULAR}
            children="No account?&nbsp;"
          />
          <Link to={REGISTER_URL}>
            <Text
              variant={TextVariant.SUBHEADING}
              color={TextColor.ONLINE}
              weight={TextWeight.MEDIUM}
              children="Create one"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
