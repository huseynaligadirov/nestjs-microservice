import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    @Inject('ORDERS_SERVICE') private orderClient: ClientProxy,
    private jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto) {
    const { password, email, ...rest } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = this.userRepository.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    const { id, name, createdAt, updatedAt } = await this.userRepository.save(newUser);
    return { id, name, email, createdAt, updatedAt };
  }


  async login(loginDto: LoginDto) {
    const { email, password } = loginDto
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email", "password"]
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }



  async findOne(id: any) {
    return id
  }

  sendSum(numbers: number[]): any {
    return this.client.send<number>({ cmd: 'sum' }, numbers).toPromise();
  }
  hello(): any {
    return this.orderClient.send({ cmd: 'hello' }, {}).toPromise();
  }


}
