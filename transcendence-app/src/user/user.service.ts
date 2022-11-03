import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UsersPaginationQueryDto } from './dto/user.pagination.dto';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { IUserRepository } from './infrastructure/db/user.repository';
import { User } from './infrastructure/db/user.entity';
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
import { UserAvatarResponseDto } from './dto/user.avatar.response.dto';
import { IBlockRepository } from './infrastructure/db/block.repository';
import { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private localFileService: LocalFileService,
    private blockRepository: IBlockRepository,
  ) {}

  retrieveUserWithId(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  retrieveUsers({
    limit = MAX_ENTRIES_PER_PAGE,
    offset = 0,
    sort = BooleanString.False,
    search = '',
  }: UsersPaginationQueryDto): Promise<User[] | null> {
    return this.userRepository.getPaginatedUsers({
      limit,
      offset,
      sort,
      search,
    });
  }

  async retrieveUserWithUserName(
    username: string,
    userMe?: User,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.getByUsername(username);

    if (user && userMe) {
      const isBlocked = await this.isUserBlockedByMe(userMe, user.id);
      return new UserResponseDto(user, isBlocked);
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
        ...userDto,
      },
    );
  }

  updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userRepository.updateById(userId, updateUserDto);
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
  ): Promise<UserAvatarResponseDto | null> {
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
  ): Promise<UserAvatarResponseDto | null> {
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

  retrieveUserWithAuthProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<User | null> {
    return this.userRepository.getByAuthProvider(provider, providerId);
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
