import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
          queue: process.env.RABBITMQ_USERS_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`],
          queue: process.env.RABBITMQ_ORDERS_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      }
    ]),
  ],
  providers: [SharedService],
  exports: [SharedService, ClientsModule],
})
export class SharedModule {}
