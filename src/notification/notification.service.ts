import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Order } from 'src/order/entities/order.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UsersService,
  ) {}

  async createNotification(
    userEmail: string,
    message: string,
    orderId: number,
  ) {
    const user = await this.userService.findByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const notification = this.notificationRepository.create({
      userId: user.id,
      message,
      orderId,
      createdAt: new Date(),
      isRead: false,
    });
    return await this.notificationRepository.save(notification);
  }

  async getUnreadNotifications(userEmail: string) {
    const user = await this.userService.findByEmail(userEmail);
    if (!user) return [];
    return await this.notificationRepository.find({
      where: { userId: user.id, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAllAsRead(userEmail: string) {
    const user = await this.userService.findByEmail(userEmail);
    if (!user) return;

    await this.notificationRepository.update(
      { userId: user.id, isRead: false },
      { isRead: true },
    );
  }

  async findActiveOrder(userEmail: string): Promise<Order | null> {
    const user = await this.userService.findByEmail(userEmail);
    if (!user) return null;

    return await this.orderRepository.findOne({
      where: {
       userId: user.id,
        status: Not(In(['отклонена', 'пропуск выдан'])),
      },
      order: { createdAt: 'DESC' },
    });
  }
}
