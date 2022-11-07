import { Block } from './block.entity';

export abstract class IBlockRepository {
  abstract addBlock(block: Block): Promise<Block | null>;
  abstract getBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<Block | null>;
  abstract deleteBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<Block | null>;
}
