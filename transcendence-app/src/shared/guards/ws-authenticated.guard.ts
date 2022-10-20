import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';

@Injectable()
export class WsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const request = client.request;
    return request.isAuthenticated();
  }
}
