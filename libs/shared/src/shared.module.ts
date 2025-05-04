import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config()

@Module({
  imports: [
    ClientsModule.register([

      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
          queue: process.env.RABBITMQ_USERS_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      }
    ]),

    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService]
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [SharedService],
  exports: [SharedService, ClientsModule, JwtModule],
})
export class SharedModule { }
