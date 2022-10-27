import { Injectable, StreamableFile } from '@nestjs/common';
import { UserRequestDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UsersPaginationQueryDto } from './dto/user.pagination.dto';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { IUserRepository } from './infrastructure/db/user.repository';
import { User } from './user.domain';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalFileService } from '../shared/local-file/local-file.service';
import {
  AVATAR_MIMETYPE_WHITELIST,
  MAX_ENTRIES_PER_PAGE,
} from '../shared/constants';
import { createReadStream } from 'fs';
import { loadEsmModule } from '../shared/utils';
import { AuthProviderType } from '../auth/auth-provider/auth-provider.service';
import { UserAvatarDto } from './dto/user.avatar.dto';
import { IBlockRepository } from './infrastructure/db/block.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private localFileService: LocalFileService,
    private blockRepository: IBlockRepository,
  ) {}

  async retrieveUserWithId(id: string): Promise<User | null> {
    const user = await this.userRepository.getById(id);
    return user ? new User(user) : null;
  }

  async retrieveUsers({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: UsersPaginationQueryDto): Promise<User[] | null> {
    const users = await this.userRepository.getPaginatedUsers({
      limit,
      offset,
      sort,
      search,
    });
    return users ? users.map((user) => new User(user)) : null;
  }

  async retrieveUserWithUserName(
    username: string,
    userMe?: User,
  ): Promise<UserDto | null> {
    const user = await this.userRepository.getByUsername(username);

    if (user && userMe) {
      return {
        ...user,
        isBlocked: await this.isUserBlockedByMe(userMe, user.id),
      };
    }
    return null;
  }

  async addUser(userDto: UserRequestDto): Promise<User | null> {
    const user = await this.userRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...userDto,
    });
    return user ? new User(user) : null;
  }

  async addAvatarAndUser(
    avatarId: string,
    avatarDto: LocalFileDto,
    userDto: UserRequestDto,
  ): Promise<User | null> {
    const user = await this.userRepository.addAvatarAndAddUser(
      { id: avatarId, createdAt: new Date(Date.now()), ...avatarDto },
      {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        avatarX: 0,
        avatarY: 0,
        ...userDto,
      },
    );
    return user ? new User(user) : null;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const user = await this.userRepository.updateById(userId, updateUserDto);
    return user ? new User(user) : null;
  }

  async getAvatar(userId: string): Promise<StreamableFile | null> {
    const user = await this.userRepository.getById(userId);

    if (!user || !user.avatarId) {
      return null;
    }

    return this.getAvatarByAvatarId(user.avatarId);
  }

  async getAvatarByAvatarId(avatarId: string): Promise<StreamableFile | null> {
    const file = await this.localFileService.getFileById(avatarId);

    if (!file) {
      return null;
    }
    return this.streamAvatarData(file);
  }

  private async isUserBlockedByMe(
    userMe: User,
    userId: string,
  ): Promise<boolean | null> {
    if (userMe.id === userId) {
      return null;
    }

    const block = await this.blockRepository.getBlock(userMe.id, userId);
    return block?.blockedId === userId ?? false;
  }

  private async addAvatarAndUpdateUser(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<UserAvatarDto | null> {
    const avatarUUID = uuidv4();
    const updatedUser = await this.userRepository.addAvatarAndUpdateUser(
      { id: avatarUUID, createdAt: new Date(Date.now()), ...newAvatarFileDto },
      user,
    );
    if (!updatedUser) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }
    return {
      avatarId: avatarUUID,
      file: this.streamAvatarData(newAvatarFileDto),
    };
  }

  private async deleteAvatar(avatarId: string) {
    const avatarFile = await this.localFileService.deleteFileById(avatarId);
    if (avatarFile) {
      this.localFileService.deleteFileData(avatarFile.path);
    }
  }

  async addAvatar(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<UserAvatarDto | null> {
    const previousAvatarId = user.avatarId;
    const avatar = await this.addAvatarAndUpdateUser(user, newAvatarFileDto);
    if (!avatar) {
      return null;
    }
    if (previousAvatarId) {
      await this.deleteAvatar(previousAvatarId);
    }
    return avatar;
  }

  private streamAvatarData(fileDto: LocalFileDto): StreamableFile {
    const stream = createReadStream(fileDto.path);

    return new StreamableFile(stream, {
      type: fileDto.mimetype,
      disposition: `inline; filename="${fileDto.filename}"`,
      length: fileDto.size,
    });
  }

  async validateAvatarType(path: string): Promise<boolean | undefined> {
    /**
     * Import 'file-type' ES-Module in CommonJS Node.js module
     */
    const { fileTypeFromFile } = await loadEsmModule<
      typeof import('file-type')
    >('file-type');
    const fileTypeResult = await fileTypeFromFile(path);
    const isValid =
      fileTypeResult && AVATAR_MIMETYPE_WHITELIST.includes(fileTypeResult.mime);
    if (!isValid) {
      this.localFileService.deleteFileData(path);
    }
    return isValid;
  }

  async retrieveUserWithAuthProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<User | null> {
    const user = await this.userRepository.getByAuthProvider(
      provider,
      providerId,
    );
    return user ? new User(user) : null;
  }

  addBlock(blockerId: string, blockedId: string) {
    return this.blockRepository.addBlock({ blockerId, blockedId });
  }

  getBlock(blockerId: string, blockedId: string) {
    return this.blockRepository.getBlock(blockerId, blockedId);
  }

  deleteBlock(blockerId: string, blockedId: string) {
    return this.blockRepository.deleteBlock(blockerId, blockedId);
  }
}
