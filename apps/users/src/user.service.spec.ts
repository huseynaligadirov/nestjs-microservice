import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: ReturnType<typeof mockUserRepository>;
  let jwtService: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  describe('create()', () => {
    it('should create a new user successfully', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockImplementation((x) => x);
      userRepo.save.mockResolvedValue({
        id: '123',
        name: dto.name,
        email: dto.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('should throw conflict if email exists', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'exists' });

      await expect(
        service.create({ email: 'test@example.com', password: 'pass', name: 'X' }),
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('login()', () => {
    it('should return JWT token on valid login', async () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      userRepo.findOne.mockResolvedValue(user);
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login({ email: user.email, password: 'password123' });

      expect(result).toEqual({ access_token: 'mock-jwt-token' });
    });

    it('should throw Unauthorized if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(
        service.login({ email: 'notfound@mail.com', password: '123' }),
      ).rejects.toThrow('User not found');
    });

    it('should throw Unauthorized if password is wrong', async () => {
      userRepo.findOne.mockResolvedValue({
        email: 'test@example.com',
        password: await bcrypt.hash('rightpass', 10),
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpass' }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
