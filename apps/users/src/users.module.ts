import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConfigModule } from "@nestjs/config"
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from '@app/shared';
import {config} from 'dotenv'
import { JwtModule } from '@nestjs/jwt';

config()

@Module({
  imports: [
   SharedModule,
   JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
   TypeOrmModule.forRoot({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_USERS_DB || process.env.POSTGRES_DB,
    entities: [User],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([User]),
  ConfigModule.forRoot(),],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
