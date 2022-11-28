import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
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
import {
  AVATAR_MIMETYPE_WHITELIST,
  MAX_ENTRIES_PER_PAGE,
} from '../shared/constants';
import { createReadStream } from 'fs';
import { AuthProviderType } from '../auth/auth-provider/auth-provider.service';
import { UserAvatarResponseDto } from './dto/user.avatar.response.dto';
import { IBlockRepository } from './infrastructure/db/block.repository';
import { UserBlockRelation, UserResponseDto } from './dto/user.response.dto';
import { PaginationWithSearchQueryDto } from '../shared/dtos/pagination-with-search.query.dto';
import { AvatarService } from '../shared/avatar/avatar.service';
import { SocketService } from '../socket/socket.service';
import { Password } from '../shared/password';

@Injectable()
export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private localFileService: LocalFileService,
    private blockRepository: IBlockRepository,
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

  async retrieveUserWithUserName(
    username: string,
    userMe?: User,
  ): Promise<UserResponseDto | null> {
    const user = await this.userRepository.getByUsername(username);

    if (user && userMe) {
      const blockRelation = await this.getBlockRelation(userMe.id, user.id);
      return new UserResponseDto(user, blockRelation);
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

    if (
      !user.password ||
      !updateUserDto.oldPassword ||
      (await Password.compare(user.password, updateUserDto.oldPassword)) ===
        false
    ) {
      throw new ForbiddenException('Incorrect password');
    }
    if (!updateUserPassword.password) {
      throw new UnprocessableEntityException('Password required');
    }
    const hashedPassword = await Password.toHash(updateUserPassword.password);
    const ret = this.userRepository.updateById(user.id, {
      ...updateUserPassword,
      password: hashedPassword,
    });
    return ret;
  }

  private async getBlockRelation(
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
    const isValid = await this.avatarService.validateAvatarType(
      newAvatarFileDto.path,
    );
    if (!isValid) {
      const allowedTypes = AVATAR_MIMETYPE_WHITELIST.join(', ');
      throw new UnprocessableEntityException(
        `Validation failed (allowed types are ${allowedTypes})`,
      );
    }

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
}
