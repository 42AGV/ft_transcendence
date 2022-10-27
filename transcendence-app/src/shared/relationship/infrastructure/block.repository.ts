import { BlockEntity } from './block.entity';

export abstract class IBlockRepository {
  abstract addBlock(block: BlockEntity): Promise<BlockEntity | null>;
}
