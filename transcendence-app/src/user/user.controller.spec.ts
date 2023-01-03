import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './infrastructure/db/user.entity';
import { AvatarFileInterceptor } from '../shared/avatar/interceptors/avatar.file.interceptor';
import { UserWithAuthorization } from '../authorization/infrastructure/db/user-with-authorization.entity';
import { AuthorizationService } from '../authorization/authorization.service';

const testUserMe = new User(
  new User({
    username: 'test',
    email: 'test@test.com',
    fullName: 'test',
    password: null,
    avatarId: uuidv4(),
    avatarX: 0,
    avatarY: 0,
    id: uuidv4(),
    createdAt: new Date(Date.now()),
  }),
);
const testUserDto: CreateUserDto = {
  username: 'user',
  email: 'afgv@github.com',
  fullName: 'user',
  password: null,
};
const testUsername = 'paquito';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;
  const mockAvatarFileInterceptor = {};
  let mockAuthService: Partial<AuthorizationService> = {
    getUserWithAuthorizationFromUsername: (
      arg0?: any,
    ): Promise<UserWithAuthorization> => {
      return new Promise((): UserWithAuthorization => {
        return {
          userId: '544cdc51-e289-4073-8956-75babb1feec9',
          username: 'a',
          gOwner: false,
          gAdmin: false,
          gBanned: false,
        };
      });
    },
  };

  beforeEach(async () => {
    mockUserService = {
      retrieveUserWithUserName: (username: string) => {
        return Promise.resolve({
          id: uuidv4(),
          createdAt: new Date(Date.now()),
          avatarId: uuidv4(),
          avatarX: 0,
          avatarY: 0,
          ...testUserDto,
          username,
          blockRelation: {
            isUserBlockedByMe: false,
            amIBlockedByUser: false,
          },
          isFriend: true,
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthorizationService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideInterceptor(AvatarFileInterceptor)
      .useValue(mockAvatarFileInterceptor)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  describe('getUserByUsername', () => {
    describe('when user with username exists', () => {
      it('should return the user object', async () => {
        const user = await controller.getUserByUserName(
          testUserMe,
          testUsername,
        );
        expect(user.username).toEqual(testUsername);
      });
    });

    describe('when user with username does not exists', () => {
      it('should throw the "NotFoundException"', async () => {
        mockUserService.retrieveUserWithUserName = () => Promise.resolve(null);
        expect.assertions(1);
        try {
          await controller.getUserByUserName(testUserMe, testUsername);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
