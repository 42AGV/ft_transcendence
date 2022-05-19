import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { TypeDBModule } from '@afgv/db';
// import { UserEntity } from './user.entity';

@Module({
  // imports: [TypeDBModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
