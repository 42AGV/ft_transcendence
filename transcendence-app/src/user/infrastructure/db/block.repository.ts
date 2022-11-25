import { Block } from './block.entity';
import { User } from './user.entity';

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
  abstract getBlocks(blockerId: string): Promise<User[] | null>;
}
