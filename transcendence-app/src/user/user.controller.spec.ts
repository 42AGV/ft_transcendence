import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UnprocessableEntityException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const testUserDto: UserDto = {
  username: 'user',
  email: 'afgv@github.com',
  avatarId: uuidv4(),
};
const testUserId = uuidv4();

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      retrieveUserWithUserName: (username: string) => {
        return Promise.resolve({
          id: testUserId,
          createdAt: new Date(Date.now()),
          ...testUserDto,
          username,
        });
      },
      retrieveUserWithId: (id: string) => {
        return Promise.resolve({
          id,
          createdAt: new Date(Date.now()),
          ...testUserDto,
        });
      },
      addUser: (userDto: UserDto) => {
        return Promise.resolve({
          id: testUserId,
          createdAt: new Date(Date.now()),
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
      ],
    }).compile();

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

  describe('getUserById', () => {
    describe('when user with ID exists', () => {
      it('should return the user object', async () => {
        const user = await controller.getUserById(testUserId);
        expect(user.id).toEqual(testUserId);
      });
    });

    describe('when user with ID does not exists', () => {
      it('should throw the "NotFoundException"', async () => {
        mockUserService.retrieveUserWithId = () => Promise.resolve(null);
        expect.assertions(1);
        try {
          await controller.getUserById(testUserId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
