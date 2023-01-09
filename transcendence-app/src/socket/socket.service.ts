import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { IFriendRepository } from '../user/infrastructure/db/friend.repository';
import { UserToRoleDto } from '../authorization/dto/user-to-role.dto';
import { Action } from '../shared/enums/action.enum';
import { User } from '../user/infrastructure/db/user.entity';
import { UserWithAuthorization } from '../authorization/infrastructure/db/user-with-authorization.entity';
import { AuthorizationService } from '../authorization/authorization.service';
import { CaslAbilityFactory } from '../authorization/casl-ability.factory';
import { WsException } from '@nestjs/websockets';
import { UserToRole } from '../authorization/infrastructure/db/user-to-role.entity';

@Injectable()
export class SocketService {
  public socket: Server | null = null;

  constructor(
    private friendsRepository: IFriendRepository,
    private authorizationService: AuthorizationService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

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

  private async setUpPermissions(client: Socket) {
    const user = new User(client.request.user);
    const authUserId: string = user.id;
    let userWithAuthorization: UserWithAuthorization | null = null;
    try {
      userWithAuthorization =
        await this.authorizationService.getUserWithAuthorizationFromId(
          authUserId,
        );
    } catch (e) {
      if (e instanceof Error) {
        throw new WsException(e.message);
      }
      throw new WsException('Authenticated user not found');
    }
    if (userWithAuthorization) {
      const ability = this.caslAbilityFactory.defineAbilitiesFor(
        userWithAuthorization,
      );
      return { authUserId, userWithAuthorization, ability };
    } else {
      throw new WsException('Authenticated user not found');
    }
  }

  async addUserWithRoles(
    userToRoleDto: UserToRoleDto,
    client: Socket,
  ): Promise<void> {
    if (!this.socket) {
      return;
    }
    const { authUserId, ability } = await this.setUpPermissions(client);
    const destAuthUser =
      await this.authorizationService.getUserWithAuthorizationFromId(
        userToRoleDto.id,
      );
    if (
      ability.cannot(Action.Update, destAuthUser) ||
      ability.cannot(Action.Create, new UserToRole(userToRoleDto))
    ) {
      throw new WsException('Not allowed to add this role');
    }
    try {
      const newRole = await this.authorizationService.addUserToRole(
        userToRoleDto,
      );
      if (newRole) {
        this.socket.to(authUserId).emit('addedUserToRole', { ...newRole });
        this.socket
          .to(userToRoleDto.id)
          .emit('addedUserToRole', { ...newRole });
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new WsException(e.message);
      }
      throw new WsException("Couldn't add role to user");
    }
  }

  async deleteUserWithRoles(
    userToRoleDto: UserToRoleDto,
    client: Socket,
  ): Promise<void> {
    if (!this.socket) {
      return;
    }
    const { authUserId, ability } = await this.setUpPermissions(client);

    const destAuthUser =
      await this.authorizationService.getUserWithAuthorizationFromId(
        userToRoleDto.id,
      );
    if (
      ability.cannot(Action.Update, destAuthUser) ||
      ability.cannot(Action.Delete, new UserToRole(userToRoleDto))
    ) {
      throw new WsException('Not allowed to remove this role');
    }
    try {
      const deletedRole = await this.authorizationService.deleteUserToRole(
        userToRoleDto,
      );
      if (deletedRole) {
        this.socket
          .to(authUserId)
          .emit('deletedUserToRole', { ...deletedRole });
        this.socket
          .to(userToRoleDto.id)
          .emit('deletedUserToRole', { ...deletedRole });
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new WsException(e.message);
      }
      throw new WsException("Couldn't delete role for user");
    }
  }
}
