import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  // @MessagePattern({ cmd: 'create_user' })
  // create(@Payload() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @MessagePattern({ cmd: 'get_user' })
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }


  @Get('sum')
  async getSum(): Promise<number> {
    const numbers = [1, 2, 3, 4];
    return this.userService.sendSum(numbers);
  }
  @Get('hello')
  async hellooo() {
    return this.userService.hello()
  }

  @MessagePattern({ cmd: 'sum' }) // <== Must match exactly
  accumulate(data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }



}
