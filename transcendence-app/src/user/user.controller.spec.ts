import { Test, TestingModule } from '@nestjs/testing';
import { AvatarFileInterceptor, UserController } from './user.controller';
import {
  HttpStatus,
  INestApplication,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthenticatedGuard } from '../shared/guards/authenticated.guard';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/env.validation';

const testUserDto: UserDto = {
  username: 'user',
  email: 'afgv@github.com',
  avatar_id: uuidv4(),
};
const testUserId = uuidv4();

describe('User Controller end to end test', () => {
  let app: INestApplication;
  const canActivate = jest.fn(() => true);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({
          envFilePath: '.env.sample',
          isGlobal: true,
          cache: true,
          validate,
        }),
      ],
      controllers: [UserController],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue({ canActivate })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create a user', async () => {
    const server = await app.getHttpServer();
    const response = await request(server)
      .post('/users')
      .send(testUserDto)
      .expect(HttpStatus.CREATED);
    await request(server)
      .get(`/users/${response.body.id}`)
      .expect(HttpStatus.OK);
    await request(server)
      .get(`/users/${testUserId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should return an array of usernames', async () => {
    const server = await app.getHttpServer();
    for (let i = 0; i < 50; i++) {
      await request(server)
        .post('/users')
        .send({
          username: 'user' + i,
          email: 'afgv@github.com',
          avatar_id: uuidv4(),
        });
    }
    const response = await request(server)
      .get('/users/?limit=20&offset=0&sort=true')
      .expect(HttpStatus.OK);
    expect(response.body.length).toBe(20);
    await request(server).get('/users/').expect(HttpStatus.OK);
  });

  it('returns forbidden if guard fails', () => {
    canActivate.mockReturnValueOnce(false);
    return request(app.getHttpServer())
      .get('/users/me')
      .expect(HttpStatus.FORBIDDEN);
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('User Controller unit tests', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;
  const mockAvatarFileInterceptor = {};

  beforeEach(async () => {
    mockUserService = {
      retrieveUserWithUserName: (username: string) => {
        return Promise.resolve({
          id: testUserId,
          created_at: new Date(Date.now()),
          ...testUserDto,
          username,
        });
      },
      retrieveUserWithId: (id: string) => {
        return Promise.resolve({
          id,
          created_at: new Date(Date.now()),
          ...testUserDto,
        });
      },
      addUser: (userDto: UserDto) => {
        return Promise.resolve({
          id: testUserId,
          created_at: new Date(Date.now()),
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
    })
      .overrideInterceptor(AvatarFileInterceptor)
      .useValue(mockAvatarFileInterceptor)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('addUser create a new user if one does not exist', async () => {
    mockUserService.retrieveUserWithUserName = () => Promise.resolve(null);
    const user = await controller.addUser(testUserDto);
    expect(user.id).toEqual(testUserId);
    expect(user.username).toEqual(testUserDto.username);
  });

  it('addUser throws if the user exist', async () => {
    expect.assertions(1);
    try {
      await controller.addUser(testUserDto);
    } catch (err) {
      expect(err).toBeInstanceOf(UnprocessableEntityException);
    }
  });

  it('getUserById returns an existing user', async () => {
    const user = await controller.getUserById(testUserId);
    expect(user.id).toEqual(testUserId);
  });

  it('getUserById throws if user does not exist', async () => {
    mockUserService.retrieveUserWithId = () => Promise.resolve(null);
    expect.assertions(1);
    try {
      await controller.getUserById(testUserId);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
