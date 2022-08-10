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

@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private localFileService: LocalFileService,
  ) {}

  retrieveUserWithId(id: string): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  retrieveUsers(queryDto: UsersPaginationQueryDto): Promise<User[] | null> {
    const limit = queryDto.limit ?? MAX_USER_ENTRIES_PER_PAGE;
    const offset = queryDto.offset ?? 0;
    const sort = queryDto.sort ?? BooleanString.False;

    return this.userRepository.getPaginatedUsers({
      limit,
      offset,
      sort,
    });
  }

  retrieveUserWithUserName(username: string): Promise<User | null> {
    return this.userRepository.getByUsername(username);
  }

  addUser(user: UserDto): Promise<User | null> {
    return this.userRepository.add({
      id: uuidv4(),
      createdAt: new Date(Date.now()),
      ...user,
    });
  }

  addAvatarAndUser(fileDto: LocalFileDto, userDto: UserDto) {
    return this.userRepository.addAvatarAndAddUser(
      { id: uuidv4(), createdAt: new Date(Date.now()), ...fileDto },
      { id: uuidv4(), createdAt: new Date(Date.now()), ...userDto },
    );
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateById(userId, updateUserDto);
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

  private async updateAvatar(
    avatarId: string,
    newAvatarFileDto: LocalFileDto,
  ): Promise<StreamableFile | null> {
    const avatarFile = await this.localFileService.getFileById(avatarId);
    if (!avatarFile) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }

    const updatedAvatarFile = await this.localFileService.updateFileById(
      avatarFile.id,
      newAvatarFileDto,
    );
    if (!updatedAvatarFile) {
      this.localFileService.deleteFileData(newAvatarFileDto.path);
      return null;
    }
    this.localFileService.deleteFileData(avatarFile.path);
    return this.streamAvatarData(updatedAvatarFile);
  }

  async addAvatar(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<StreamableFile | null> {
    if (user.avatarId === null) {
      return this.addAvatarAndUpdateUser(user, newAvatarFileDto);
    }

    return this.updateAvatar(user.avatarId, newAvatarFileDto);
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
    const { fileTypeFromFile } = await (eval('import("file-type")') as Promise<
      typeof import('file-type')
    >);
    const fileTypeResult = await fileTypeFromFile(path);
    const isValid =
      fileTypeResult && AVATAR_MIMETYPE_WHITELIST.includes(fileTypeResult.mime);
    if (!isValid) {
      this.localFileService.deleteFileData(path);
    }
    return isValid;
  }
}
