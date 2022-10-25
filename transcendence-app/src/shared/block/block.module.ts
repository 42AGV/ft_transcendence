import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
