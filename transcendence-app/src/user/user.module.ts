import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { BlockModule } from '../shared/block/block.module';

@Module({
  imports: [DbModule, LocalFileModule, BlockModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
