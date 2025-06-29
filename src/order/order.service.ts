import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { In, Not, Repository } from 'typeorm';
import { NotificationGateway } from '../notification/notification.gateway';
import { User } from 'src/users/entities/user.entity/user.entity';
import { CreateOrderDto } from './entities/create-order-dto';
import { UsersService } from 'src/users/users.service';

const FINAL_STATUSES = ['отклонена', 'пропуск выдан'];

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationGateway: NotificationGateway,
    private userService: UsersService,
  ) {}

  async createOrder(orderData: CreateOrderDto, email: string): Promise<Order> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }
    const order = this.orderRepository.create({
      ...orderData,
      user,
      createdAt: new Date(), // Явная инициализация даты
      updatedAt: new Date(),
    });

    return await this.orderRepository.save(order);
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) return null;

    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();
    await this.orderRepository.save(order);

    if (order.status && oldStatus !== order.status) {
      const message = `Статус заявки был обновлен на "${order.status}"`;
      await this.notificationGateway.sendNotification(
        order.user.email,
        message,
        order.id,
      );
    }

    // Если заявка завершена, отключаем уведомления
    if (['отклонена', 'пропуск выдан'].includes(order.status)) {
      const socket = this.notificationGateway.getUserSocket(order.user.email);
      if (socket) {
        socket.disconnect();
      }
    }

    return order;
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

  async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        status: Not(In(['отклонена', 'пропуск выдан'])),
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findLastUserOrder(userEmail: string): Promise<Order | null> {
    const user = await this.userService.findByEmail(userEmail);
    if (!user) return null;

    return await this.orderRepository.findOne({
      where: {
        userId: user.id,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
