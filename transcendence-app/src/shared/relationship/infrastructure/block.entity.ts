export enum BlockKeys {
  BLOCKER_ID = '"blockerId"',
  BLOCKED_IT = '"blockedId"',
}

export class BlockEntity {
  constructor(public blockerId: string, public blockedId: string) {}
}
