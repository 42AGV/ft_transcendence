import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { IUserRepository } from './infrastructure/db/user.repository';
import { User } from './infrastructure/db/user.entity';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { MAX_ENTRIES_PER_PAGE } from '../shared/constants';
import { AuthProviderType } from '../auth/auth-provider/auth-provider.service';
import { IBlockRepository } from './infrastructure/db/block.repository';
import { UserBlockRelation, UserResponseDto } from './dto/user.response.dto';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { AvatarService } from '../shared/avatar/avatar.service';
import { SocketService } from '../socket/socket.service';
import { Password } from '../shared/password';
import { IFriendRepository } from './infrastructure/db/friend.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private localFileService: LocalFileService,
    private blockRepository: IBlockRepository,
    private friendRepository: IFriendRepository,
    private avatarService: AvatarService,
    private socketService: SocketService,
  ) {}

  retrieveUserWithId(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  retrieveUsers({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: PaginationWithSearchQueryDto): Promise<User[] | null> {
    return this.userRepository.getPaginatedUsers({
      limit,
      offset,
      sort,
      search,
    });
  }

  async retrieveUserWithUserNameWithoutFriend(
    username: string,
  ): Promise<User | null> {
    return await this.userRepository.getByUsername(username);
  }

  async retrieveUserWithUserName(
    username: string,
    userMe?: User,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.getByUsername(username);

    if (user && userMe) {
      const blockRelation = await this.getBlockRelation(userMe.id, user.id);
      const isFriend = await this.getIsFriend(userMe.id, user.id);
      return new UserResponseDto(user, blockRelation, isFriend);
    }
    return null;
  }

  addAvatarAndUser(
    avatarId: string,
    avatarDto: LocalFileDto,
    userDto: CreateUserDto,
  ): Promise<User | null> {
    return this.userRepository.addAvatarAndAddUser(
      { id: avatarId, createdAt: new Date(Date.now()), ...avatarDto },
      {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        avatarId,
        avatarX: 0,
        avatarY: 0,
        twoFactorAuthenticationSecret: null,
        isTwoFactorAuthenticationEnabled: false,
        level: 1,
        ...userDto,
      },
    );
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    if (!updateUserDto.oldPassword && !updateUserDto.password) {
      return this.userRepository.updateById(userId, updateUserDto);
    }
    const { oldPassword, confirmationPassword, ...updateUserPassword } =
      updateUserDto;
    const user = await this.retrieveUserWithId(userId);
    if (!user) {
      throw new NotFoundException();
    }
    if (updateUserDto.password !== updateUserDto.confirmationPassword) {
      throw new ForbiddenException(
        'Password and confirmation password must match',
      );
    }
    if (
      !user.password ||
      !updateUserDto.oldPassword ||
      !(await Password.compare(user.password, updateUserDto.oldPassword))
    ) {
      throw new ForbiddenException('Incorrect password');
    }
    if (!updateUserPassword.password) {
      throw new UnprocessableEntityException('Password required');
    }
    const hashedPassword = await Password.toHash(updateUserPassword.password);
    return this.userRepository.updateById(user.id, {
      ...updateUserPassword,
      password: hashedPassword,
    });
  }

  async getBlockRelation(
    userMeId: string,
    userId: string,
  ): Promise<UserBlockRelation | null> {
    if (userMeId === userId) {
      return null;
    }

    const meBlock = await this.blockRepository.getBlock(userMeId, userId);
    const userBlock = await this.blockRepository.getBlock(userId, userMeId);

    return {
      isUserBlockedByMe: meBlock?.blockedId === userId ?? false,
      amIBlockedByUser: userBlock?.blockedId === userMeId ?? false,
    };
  }

  private async addAvatarAndUpdateUser(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<User | null> {
    const avatarUUID = uuidv4();
    const updatedUser = await this.userRepository.addAvatarAndUpdateUser(
      { id: avatarUUID, createdAt: new Date(Date.now()), ...newAvatarFileDto },
      user,
    );
    if (!updatedUser) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }
    return updatedUser;
  }

  async addAvatar(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<User | null> {
    await this.avatarService.validateAvatarType(newAvatarFileDto.path);
    const previousAvatarId = user.avatarId;
    const updatedUser = await this.addAvatarAndUpdateUser(
      user,
      newAvatarFileDto,
    );
    if (!updatedUser) {
      return null;
    }
    if (previousAvatarId) {
      await this.avatarService.deleteAvatar(previousAvatarId);
    }
    return updatedUser;
  }

  retrieveUserWithAuthProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<User | null> {
    return this.userRepository.getByAuthProvider(provider, providerId);
  }

  async addBlock(blockerId: string, blockedId: string) {
    const block = await this.blockRepository.addBlock({ blockerId, blockedId });
    if (!block) {
      throw new UnprocessableEntityException();
    }
    this.socketService.addBlock(blockerId, blockedId);
  }

  async deleteBlock(blockerId: string, blockedId: string) {
    const block = await this.blockRepository.deleteBlock(blockerId, blockedId);
    if (!block) {
      throw new NotFoundException();
    }
    this.socketService.deleteBlock(blockerId, blockedId);
  }

  getBlocks(blockerId: string) {
    return this.blockRepository.getBlocks(blockerId);
  }

  async addFriend(followerId: string, followedId: string) {
    const friend = await this.friendRepository.addFriend({
      followerId,
      followedId,
    });
    if (!friend) {
      throw new UnprocessableEntityException();
    }
    this.socketService.addFriend(followerId, followedId);
  }

  async deleteFriend(followerId: string, followedId: string) {
    const friend = await this.friendRepository.deleteFriend(
      followerId,
      followedId,
    );
    if (!friend) {
      throw new NotFoundException();
    }
    this.socketService.deleteFriend(followerId, followedId);
  }

  async getIsFriend(userMeId: string, followedId: string) {
    if (userMeId === followedId) {
      return null;
    }
    const friend = await this.friendRepository.getFriend(userMeId, followedId);

    return !!friend;
  }

  async getFriend(userMeId: string, followedId: string) {
    return this.friendRepository.getFriend(userMeId, followedId);
  }

  async getFriends(
    followerId: string,
    {
      limit = MAX_ENTRIES_PER_PAGE,
      offset = 0,
      sort = BooleanString.False,
      search = '',
    }: PaginationWithSearchQueryDto,
  ): Promise<User[] | null> {
    const friends = await this.friendRepository.getPaginatedFriends(
      followerId,
      {
        limit,
        offset,
        sort,
        search,
      },
    );
    if (!friends) {
      throw new UnprocessableEntityException();
    }
    return friends;
  }

  setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.updateById(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  enableTwoFactorAuthentication(userId: string) {
    return this.userRepository.updateById(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  disableTwoFactorAuthentication(userId: string) {
    return this.userRepository.updateById(userId, {
      isTwoFactorAuthenticationEnabled: false,
      twoFactorAuthenticationSecret: null,
    });
  }
}
