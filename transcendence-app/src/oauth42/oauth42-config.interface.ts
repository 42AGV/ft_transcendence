import { Environment } from '../shared/enums/environment.enum';

export interface OAuth42Config {
  FORTYTWO_APP_ID: string;
  FORTYTWO_APP_SECRET: string;
  FORTYTWO_APP_CALLBACK_URL: string;
  FORTYTWO_APP_AUTHORIZATION_URL: string;
  FORTYTWO_APP_TOKEN_URL: string;
  FORTYTWO_APP_PROFILE_URL: string;
  NODE_ENV: Environment;
}
