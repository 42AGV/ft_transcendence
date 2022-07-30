import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const testUserDto: UserDto = {
  username: 'user',
  email: 'afgv@github.com',
  avatar: 'www.example.jpg',
};
const testUserId = uuidv4();

describe('User Controller unit tests', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      findOneOrCreate: (user: UserDto) => {
        return {
          id: testUserId,
          createdAt: new Date(Date.now()),
          ...user,
        };
      },
      retrieveUserWithId: (id: string) => {
        return {
          id,
          createdAt: new Date(Date.now()),
          ...testUserDto,
        };
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

  it('creates a user', async () => {
    const user = await controller.addUser(testUserDto);
    expect(user.id).toEqual(testUserId);
    expect(user.username).toEqual(testUserDto.username);
  });

  it('returns an existing user', async () => {
    const user = await controller.getUserById(testUserId);
    expect(user.id).toEqual(testUserId);
  });

  it('throws if user does not exist', async () => {
    mockUserService.retrieveUserWithId = () => null;
    expect.assertions(1);
    try {
      await controller.getUserById(testUserId);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
