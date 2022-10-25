import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '../shared/db/db.module';
import { LocalFileModule } from '../shared/local-file/local-file.module';
import { RelationshipModule } from '../shared/relationship/relationship.module';

@Module({
  imports: [DbModule, LocalFileModule, RelationshipModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
