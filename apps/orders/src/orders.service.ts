import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject('ORDERS_SERVICE') private authClient: ClientProxy
  ) { }


  async create(userId: string, dto: CreateOrderDto) {
    const order = this.orderRepository.create({ ...dto, userId });
    return this.orderRepository.save(order);
  }

  async getOrdersByUserId(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

}
