import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { SharedModule } from '@app/shared';
import {config} from 'dotenv'
import { JwtStrategy } from './strategies/jwt.strategy';
import { createTypeOrmModule } from '@app/shared/typeorm.config';

config()

@Module({
  imports: [
   SharedModule,
   createTypeOrmModule([User]),
  TypeOrmModule.forFeature([User]),],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule {}




