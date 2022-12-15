import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { AvatarModule } from '../shared/avatar/avatar.module';
import { SocketModule } from '../socket/socket.module';
import { AuthorizationModule } from '../shared/authorization/authorization.module';

@Module({
  imports: [
    DbModule,
    LocalFileModule,
    AvatarModule,
    SocketModule,
    forwardRef(() => AuthorizationModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
