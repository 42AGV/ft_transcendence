import { BlockEntity } from './block.entity';

export abstract class IBlockRepository {
  abstract addBlock(block: BlockEntity): Promise<BlockEntity | null>;
  abstract getBlock(
    blockerId: string,
    blockedId: string,
  ): Promise<BlockEntity | null>;
}
