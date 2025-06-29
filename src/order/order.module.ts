import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity/user.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    UsersModule,
    NotificationModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
