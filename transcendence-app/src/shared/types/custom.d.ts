import { Session } from 'express-session';
import { User } from '../../user/user.domain';

declare module 'http' {
  interface IncomingMessage {
    user: User;
    session: Session;
  }
}

declare module 'express-session' {
  interface Session {
    isTwoFactorAuthenticated: boolean;
  }
}
