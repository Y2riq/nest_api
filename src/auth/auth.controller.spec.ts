import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeAuthService = {
      login: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a user login and set session userId', async () => {
    const session: { userId?: number } = {};
    const user = await controller.login(
      { email: 'test@email.com', password: 'password' },
      session,
    );
    expect(user).toEqual({
      id: 1,
      email: 'test@email.com',
      password: 'password',
    });
    expect(session).toEqual({ userId: 1 });
  });
});
