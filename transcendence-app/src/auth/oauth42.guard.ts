import {
  BadGatewayException,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuth42Guard extends AuthGuard('oauth42') {
  private readonly logger = new Logger(OAuth42Guard.name);

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }

  handleRequest(err: Error, user: any) {
    if (err || !user) {
      this.logger.error(err.message);
      throw new BadGatewayException(err.message);
    }
    return user;
  }
}
