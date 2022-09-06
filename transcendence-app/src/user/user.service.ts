import { Injectable, StreamableFile } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  MAX_USER_ENTRIES_PER_PAGE,
  UsersPaginationQueryDto,
} from './dto/user.pagination.dto';
import { BooleanString } from '../shared/enums/boolean-string.enum';
import { IUserRepository } from './infrastructure/db/user.repository';
import { User } from './user.domain';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalFileService } from '../shared/local-file/local-file.service';
import { AVATAR_MIMETYPE_WHITELIST } from './constants';
import { createReadStream } from 'fs';
import { loadEsmModule } from '../shared/utils';
import { AuthProviderType } from '../auth/auth-provider/auth-provider.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private localFileService: LocalFileService,
  ) {}

  retrieveUserWithId(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  retrieveUsers({
    limit = MAX_USER_ENTRIES_PER_PAGE,
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

  retrieveUserWithUserName(username: string): Promise<User | null> {
    return this.userRepository.getByUsername(username);
  }

  addUser(user: UserDto): Promise<User | null> {
    return this.userRepository.addUser({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      avatarX: 0,
      avatarY: 0,
      ...user,
    });
  }

  addAvatarAndUser(fileDto: LocalFileDto, userDto: UserDto) {
    return this.userRepository.addAvatarAndAddUser(
      { id: uuidv4(), createdAt: new Date(Date.now()), ...fileDto },
      {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        avatarX: 0,
        avatarY: 0,
        ...userDto,
      },
    );
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
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

  private async addAvatarAndUpdateUser(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<StreamableFile | null> {
    const updatedUser = await this.userRepository.addAvatarAndUpdateUser(
      { id: uuidv4(), createdAt: new Date(Date.now()), ...newAvatarFileDto },
      user,
    );
    if (!updatedUser) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }
    return this.streamAvatarData(newAvatarFileDto);
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
  ): Promise<StreamableFile | null> {
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

  retrieveUserWithAuthProvider(provider: AuthProviderType, providerId: string) {
    return this.userRepository.getByAuthProvider(provider, providerId);
  }
}
