import { Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  providers: [RelationshipService],
  exports: [RelationshipService],
})
export class RelationshipModule {}
