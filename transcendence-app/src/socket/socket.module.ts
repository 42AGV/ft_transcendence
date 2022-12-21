import { Global, Module } from '@nestjs/common';
import { DbModule } from '../shared/db/db.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Global()
@Module({
  imports: [DbModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
