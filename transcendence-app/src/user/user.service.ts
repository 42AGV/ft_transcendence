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
      created_at: new Date(Date.now()),
      ...user,
    });
  }

  async addAvatar(user: User, fileDto: LocalFileDto): Promise<User | null> {
    const oldUserAvatarId = user.avatar_id;

    const file = await this.localFileService.saveFile(fileDto);

    if (!file) {
      this.localFileService.deleteFileData(fileDto.path);
      return user;
    }

    const updatedUser = await this.userRepository.updateByUsername(
      user.username,
      {
        avatar_id: file.id,
      },
    );

    if (oldUserAvatarId) {
      await this.localFileService.deleteFileById(oldUserAvatarId);
    }

    return updatedUser;
  }

  async getAvatar(userId: string): Promise<StreamableFile | null> {
    const user = await this.userRepository.getById(userId);

    if (!user || !user.avatar_id) {
      return null;
    }

    const file = await this.localFileService.getFileById(user.avatar_id);

    if (!file) {
      return null;
    }

    const stream = createReadStream(file.path);

    return new StreamableFile(stream, {
      type: file.mimetype,
      disposition: `inline; filename="${file.filename}"`,
      length: file.size,
    });
  }
}
