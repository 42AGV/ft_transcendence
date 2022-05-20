import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { Constants } from '../shared/enums/commonconsts.enum';

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
    await request(server)
      .post(
        "/user/new?provider=42&username=afgv&email=hello@example.com&image_url='www.example.com/example.jpg'",
      )
      .expect(HttpStatus.CREATED);
    await request(server)
      .get(`/user/${Constants.UserIdStart}`)
      .expect(HttpStatus.OK);
    await request(server).get('/user/10').expect(HttpStatus.NOT_FOUND);
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
        return new UserEntity({
          provider: user.provider,
          username: user.provider,
          email: user.email,
          image_url: user.image_url,
        });
      },
      retrieveUserWithId: (id: number) => {
        const ret_val = new UserEntity({
          provider: 'test',
          username: 'test',
          email: 'test@test.com',
          image_url: 'http://test.com/test.jpg',
        });
        ret_val.id = id;
        return ret_val;
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
    for (let i = 0; i < 10; ++i) {
      const user = await controller.addUser({
        provider: 'ft_transcendence',
        image_url: 'www.img_url.com/hello.jpg',
        username: `user_${i}`,
        email: 'afgv@github.com',
      });
      expect(user.id).toEqual(i + 2);
    }
  });

  it('returns an existing user', async () => {
    const user = await controller.getUserById('10');
    expect(user.id).toEqual(10);
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
