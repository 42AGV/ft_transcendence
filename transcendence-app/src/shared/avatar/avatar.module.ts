import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { LocalFileModule } from '../local-file/local-file.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';
import { AuthorizationModule } from '../../authorization/authorization.module';

@Module({
  imports: [DbModule, LocalFileModule, AuthorizationModule],
  providers: [AvatarService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
