export enum BlockKeys {
  BLOCKER_ID = '"blockerId"',
  BLOCKED_ID = '"blockedId"',
}

export class BlockEntity {
  constructor(public blockerId: string, public blockedId: string) {}
}
