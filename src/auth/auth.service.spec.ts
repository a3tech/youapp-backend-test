jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService (Unit)', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    jwtService = moduleRef.get(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register a user successfully', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.findByUsername.mockResolvedValue(null);

    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);

    usersService.create.mockResolvedValue({
      _id: 'user_id',
      email: 'test@mail.com',
      username: 'john',
      password: 'hashed_password',
    } as any);

    const result = await authService.register(
      'test@mail.com',
      'john',
      'password123',
    );

    expect(result).toEqual({
      id: 'user_id',
      email: 'test@mail.com',
      username: 'john',
    });
  });

  it('should throw if email already exists', async () => {
    usersService.findByEmail.mockResolvedValue({} as any);

    await expect(
      authService.register('test@mail.com', 'john', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if username already exists', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.findByUsername.mockResolvedValue({} as any);

    await expect(
      authService.register('test@mail.com', 'john', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should login successfully', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.findByUsername.mockResolvedValue({
      _id: 'user_id',
      username: 'john',
      password: 'hashed_password',
    } as any);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    jwtService.sign.mockReturnValue('jwt_token');

    const result = await authService.login('john', 'password');

    expect(result).toEqual({ accessToken: 'jwt_token' });
  });

  it('should throw if user not found', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.findByUsername.mockResolvedValue(null);

    await expect(
      authService.login('john', 'password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password is incorrect', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.findByUsername.mockResolvedValue({
      _id: 'user_id',
      username: 'john',
      password: 'hashed_password',
    } as any);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      authService.login('john', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });
});