import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SharedModule } from '@app/shared';

@Module({
  imports: [SharedModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
