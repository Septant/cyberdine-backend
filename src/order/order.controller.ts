import {
  Body,
  Controller,
  Post,
  Headers,
  Param,
  Patch,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './entities/create-order-dto';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() orderData: CreateOrderDto,
    @Headers('x-user-email') email: string,
  ): Promise<Order> {
    if (!email) {
      throw new Error('Email header is required');
    }
    return this.orderService.createOrder(orderData, email);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.orderService.updateOrderStatus(Number(id), status);
  }

  @Get('all')
  async getAllOrders() {
    return this.orderService.findAllOrders();
  }

  @Get('last')
  async getLastOrder(@Headers('x-user-email') email: string) {
    return await this.orderService.findLastUserOrder(email);
  }
}
