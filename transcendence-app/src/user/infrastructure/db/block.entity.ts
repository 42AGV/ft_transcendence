export enum BlockKeys {
  BLOCKER_ID = '"blockerId"',
  BLOCKED_ID = '"blockedId"',
}

interface BlockData {
  blockerId: string;
  blockedId: string;
}

export class Block {
  blockerId: string;
  blockedId: string;

  constructor(blockData: BlockData) {
    this.blockerId = blockData.blockerId;
    this.blockedId = blockData.blockedId;
  }
}
