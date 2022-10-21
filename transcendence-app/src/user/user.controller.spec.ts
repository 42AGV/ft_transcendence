import { Test, TestingModule } from '@nestjs/testing';
import { AvatarFileInterceptor, UserController } from './user.controller';
import { UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { BlockService } from '../shared/block/block.service';

const testUserDto: UserDto = {
  username: 'user',
  email: 'afgv@github.com',
  fullName: 'user',
  password: null,
  avatarId: uuidv4(),
};
const testUserId = uuidv4();
const testUsername = 'paquito';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;
  const mockBlockService: Partial<BlockService> = {};
  const mockAvatarFileInterceptor = {};

  beforeEach(async () => {
    mockUserService = {
      retrieveUserWithUserName: (username: string) => {
        return Promise.resolve({
          id: testUserId,
          createdAt: new Date(Date.now()),
          avatarX: 0,
          avatarY: 0,
          ...testUserDto,
          username,
        });
      },
      retrieveUserWithId: (id: string) => {
        return Promise.resolve({
          id,
          createdAt: new Date(Date.now()),
          avatarX: 0,
          avatarY: 0,
          ...testUserDto,
        });
      },
      addUser: (userDto: UserDto) => {
        return Promise.resolve({
          id: testUserId,
          createdAt: new Date(Date.now()),
          avatarX: 0,
          avatarY: 0,
          ...userDto,
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
          provide: BlockService,
          useValue: mockBlockService,
        },
      ],
    })
      .overrideInterceptor(AvatarFileInterceptor)
      .useValue(mockAvatarFileInterceptor)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  describe('addUser', () => {
    describe('when it succeeds', () => {
      it('should create a new user', async () => {
        const user = await controller.addUser(testUserDto);
        expect(user.id).toEqual(testUserId);
        expect(user.username).toEqual(testUserDto.username);
      });
    });

    describe('when it fails', () => {
      it('should throw the "UnprocessableEntityException"', async () => {
        mockUserService.addUser = () => Promise.resolve(null);
        expect.assertions(1);
        try {
          await controller.addUser(testUserDto);
        } catch (err) {
          expect(err).toBeInstanceOf(UnprocessableEntityException);
        }
      });
    });
  });

  describe('getUserByUsername', () => {
    describe('when user with username exists', () => {
      it('should return the user object', async () => {
        const user = await controller.getUserByUserName(testUsername);
        expect(user.username).toEqual(testUsername);
      });
    });

    describe('when user with ID does not exists', () => {
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
