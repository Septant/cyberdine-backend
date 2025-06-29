import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { Order } from 'src/order/entities/order.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Order]), UsersModule],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationGateway],
})
export class NotificationModule {}
