import { Injectable } from '@nestjs/common';
import { IBlockRepository } from './infrastructure/block.repository';

@Injectable()
export class RelationshipService {
  constructor(private blockRepository: IBlockRepository) {}

  addBlock(blockerId: string, blockedId: string) {
    return this.blockRepository.addBlock({ blockerId, blockedId });
  }
}
