import { Module } from '@nestjs/common';
import { LocalFileService } from './local-file.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [LocalFileService],
  exports: [LocalFileService],
})
export class LocalFileModule {}
