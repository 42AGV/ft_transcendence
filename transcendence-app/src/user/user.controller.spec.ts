import { Test, TestingModule } from '@nestjs/testing';
import { AvatarFileInterceptor, UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const testUserDto: UserRequestDto = {
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
        const user = await controller.getUserByUserName(testUsername);
        expect(user.username).toEqual(testUsername);
      });
    });

    describe('when user with username does not exists', () => {
      it('should throw the "NotFoundException"', async () => {
        mockUserService.retrieveUserWithUserName = () => Promise.resolve(null);
        expect.assertions(1);
        try {
          await controller.getUserByUserName(testUsername);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
