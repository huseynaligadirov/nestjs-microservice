import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern({ cmd: 'hello' }) // <== Must match exactly
  accumulate() {
    return 'Hello from orders'
  }
}
