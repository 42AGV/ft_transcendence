import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { AuthorizationModule } from '../authorization/authorization.module';

@Global()
@Module({
  imports: [DbModule, AuthorizationModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
