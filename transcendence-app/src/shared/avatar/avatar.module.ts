import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { LocalFileModule } from '../local-file/local-file.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  imports: [DbModule, LocalFileModule],
  providers: [AvatarService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
