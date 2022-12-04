export enum FriendKeys {
  FOLLOWER_ID = '"followerId"',
  FOLLOWED_ID = '"followeDId"',
}

interface FriendData {
  followerId: string;
  followedId: string;
}

export class Friend {
  followerId: string;
  followedId: string;

  constructor(friendData: FriendData) {
    this.followerId = friendData.followerId;
    this.followedId = friendData.followedId;
  }
}
