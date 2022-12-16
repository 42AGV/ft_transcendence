import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  public socket: Server | null = null;

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
}
