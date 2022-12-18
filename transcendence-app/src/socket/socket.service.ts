import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { IFriendRepository } from '../user/infrastructure/db/friend.repository';

@Injectable()
export class SocketService {
  public socket: Server | null = null;

  constructor(private friendsRepository: IFriendRepository) {}

  addBlock(blockerId: string, blockedId: string) {
    if (this.socket) {
      this.socket.to(blockerId).emit('block', blockedId);
    }
  }

  deleteBlock(blockerId: string, blockedId: string) {
    if (this.socket) {
      this.socket.to(blockerId).emit('unblock', blockedId);
    }
  }

  addFriend(followerId: string, followedId: string) {
    if (this.socket) {
      this.socket.to(followerId).emit('follow', followedId);
    }
  }

  deleteFriend(followerId: string, followedId: string) {
    if (this.socket) {
      this.socket.to(followerId).emit('unfollow', followedId);
    }
  }

  async getFriends(client: Socket) {
    if (this.socket) {
      const followerId = client.request.user.id;
      const friends = await this.friendsRepository.getFriends(followerId);
      const friendIds = friends ? friends.map((friend) => friend.id) : [];
      client.emit('friends', friendIds);
    }
  }
}
