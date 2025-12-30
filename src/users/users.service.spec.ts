import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { Model } from 'mongoose';

describe('UsersService (Unit)', () => {
  let service: UsersService;
  let model: jest.Mocked<Model<User>>;

  const mockUser = {
    _id: 'user_id',
    email: 'test@mail.com',
    username: 'john',
    password: 'hashed_password',
  };

  const userModelMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    model.create.mockResolvedValue(mockUser as any);

    const result = await service.create({
      email: 'test@mail.com',
      username: 'john',
      password: 'hashed_password',
    });

    expect(model.create).toHaveBeenCalledWith({
      email: 'test@mail.com',
      username: 'john',
      password: 'hashed_password',
    });
    expect(result).toEqual(mockUser);
  });

  it('should find user by email', async () => {
    model.findOne.mockResolvedValue(mockUser as any);

    const result = await service.findByEmail('test@mail.com');

    expect(model.findOne).toHaveBeenCalledWith({ email: 'test@mail.com' });
    expect(result).toEqual(mockUser);
  });

  it('should return null if email not found', async () => {
    model.findOne.mockResolvedValue(null);

    const result = await service.findByEmail('notfound@mail.com');

    expect(result).toBeNull();
  });

  it('should find user by username', async () => {
    model.findOne.mockResolvedValue(mockUser as any);

    const result = await service.findByUsername('john');

    expect(model.findOne).toHaveBeenCalledWith({ username: 'john' });
    expect(result).toEqual(mockUser);
  });

  it('should find user by id', async () => {
    model.findById.mockResolvedValue(mockUser as any);

    const result = await service.findById('user_id');

    expect(model.findById).toHaveBeenCalledWith('user_id');
    expect(result).toEqual(mockUser);
  });

  it('should return null if id not found', async () => {
    model.findById.mockResolvedValue(null);

    const result = await service.findById('unknown_id');

    expect(result).toBeNull();
  });
});