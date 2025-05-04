import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthenticatedRequest } from './types/authenticatedRequest';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyOrders(@Req() req: AuthenticatedRequest) {
    return this.ordersService.getOrdersByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: AuthenticatedRequest) {
    const {userId} = req.user;
    return this.ordersService.create(userId, dto);
  }

}
