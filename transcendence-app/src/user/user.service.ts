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
import { LocalFileService } from '../shared/local-file/local-file.service';
import { LocalFileDto } from '../shared/local-file/local-file.dto';
import { createReadStream } from 'fs';
import { AVATAR_MIMETYPE_WHITELIST } from './constants';

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

  async addAvatar(
    user: User,
    newAvatarFileDto: LocalFileDto,
  ): Promise<StreamableFile | null> {
    // If the user doesn't have an avatar yet, save the avatar file in the database and update the user avatar_id
    if (user.avatarId === null) {
      const updatedUser = await this.userRepository.addAvatarAndUpdateUser(
        { id: uuidv4(), ...newAvatarFileDto },
        user,
      );
      if (!updatedUser) {
        this.localFileService.deleteFileData(newAvatarFileDto.path);
        return null;
      }
      return this.streamAvatarData(newAvatarFileDto);
    }

    // Otherwise, update the user avatar file and delete the old avatar data from the disk
    const avatarFile = await this.localFileService.getFileById(user.avatarId);
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

  addAvatarAndUser(fileDto: LocalFileDto, userDto: UserDto) {
    return this.userRepository.addAvatarAndAddUser(
      { id: uuidv4(), ...fileDto },
      {
        id: uuidv4(),
        createdAt: new Date(Date.now()),
        ...userDto,
      },
    );
  }

  async getAvatar(userId: string): Promise<StreamableFile | null> {
    const user = await this.userRepository.getById(userId);

    if (!user || !user.avatarId) {
      return null;
    }

    const file = await this.localFileService.getFileById(user.avatarId);

    if (!file) {
      return null;
    }
    return this.streamAvatarData(file);
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
