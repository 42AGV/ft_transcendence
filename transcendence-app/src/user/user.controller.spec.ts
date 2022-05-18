import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import {NotFoundException} from '@nestjs/common';

describe('User Controller end to end test', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      controllers: [UserController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create a user', async () => {
    const server = await app.getHttpServer();
    await request(server).post('/user/1').expect(HttpStatus.CREATED);
    await request(server).get('/user/1').expect(HttpStatus.OK);
    await request(server).get('/user/2').expect(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('User Controller unit tests', () => {
  let controller: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      findOneOrCreate: (user: UserDto) => {
        return {
          id: 123,
          provider: user.provider,
          username: user.provider,
          email: user.email,
          image_url: user.image_url,
        };
      },
      retrieveUserWithId: (id: number) => {
        return {
          id,
          provider: 'test',
          username: 'test',
          email: 'test@test.com',
          image_url: 'http://test.com/test.jpg',
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
    const user : UserDto = await controller.addUser('123');
    expect(user.id).toEqual(123);
  });

  it('returns an existing user', async () => {
    const user = await controller.getUserById('123');
    expect(user!.id).toEqual(123);
  });

  it('throws if user does not exist', async () => {
    mockUserService.retrieveUserWithId = () => undefined;
    expect.assertions(1);
    try {
      await controller.getUserById('123');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
