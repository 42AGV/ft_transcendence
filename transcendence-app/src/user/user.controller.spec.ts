import { Test, TestingModule } from '@nestjs/testing';
import { AvatarFileInterceptor, UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './infrastructure/db/user.entity';

const testUserMe = new User(
  new User({
    username: 'test',
    email: 'test@test.com',
    fullName: 'test',
    password: null,
    avatarId: null,
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
  avatarId: uuidv4(),
};
const testUsername = 'paquito';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;
  const mockAvatarFileInterceptor = {};

  beforeEach(async () => {
    mockUserService = {
      retrieveUserWithUserName: (username: string) => {
        return Promise.resolve({
          id: uuidv4(),
          createdAt: new Date(Date.now()),
          avatarX: 0,
          avatarY: 0,
          ...testUserDto,
          username,
          isBlocked: false,
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
