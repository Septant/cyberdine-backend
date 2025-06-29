import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { Order } from 'src/order/entities/order.entity';
const FINAL_STATUSES = ['отклонена', 'пропуск выдан'];

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling'], // Разрешаем оба транспорта
  allowEIO3: true, // Поддержка старых клиентов
  allowedHeaders: ['x-user-email'], // Разрешаем кастомные заголовки
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Socket>();

  constructor(private readonly notificationService: NotificationService) {}

  getUserSocket(email: string) {
    return this.userSockets.get(email);
  }
  // Установка соединения сокета с пользователем
  async handleConnection(client: Socket) {
    const userEmail = client.handshake.query.email as string;
    if (!userEmail) {
      client.disconnect();
      return;
    }

    this.userSockets.set(userEmail, client);
    console.log(`Клиент подключен: ${userEmail}`);

    // При подключении проверяем активные заявки
    const activeOrder =
      await this.notificationService.findActiveOrder(userEmail);
    if (activeOrder && activeOrder.notify) {
      // Отправляем непрочитанные уведомления
      const notifications =
        await this.notificationService.getUnreadNotifications(userEmail);
      client.emit('Создание подключения', notifications);
    }
  }

  // Разрыв соединения
  handleDisconnect(client: Socket) {
    const userEmail = Array.from(this.userSockets.entries()).find(
      ([_, socket]) => socket === client,
    )?.[0];

    if (userEmail) {
      this.userSockets.delete(userEmail);
      console.log(`Клиент отключен: ${userEmail}`);
    }
  }

  async sendNotification(userEmail: string, message: string, orderId: number) {
    const notification = await this.notificationService.createNotification(
      userEmail,
      message,
      orderId,
    );
    const socket = this.userSockets.get(userEmail);

    if (socket) {
      console.log('Отправка уведомления');
      socket.emit('new_notification', notification);
    }
  }

  async markNotificationsAsRead(userEmail: string) {
    await this.notificationService.markAllAsRead(userEmail);
    const socket = this.userSockets.get(userEmail);

    if (socket) {
      socket.emit('notifications_marked_as_read');
    }
  }

  async sendOrderUpdate(email: string, order: Order): Promise<void> {
    const socket = this.userSockets.get(email);
    if (socket) {
      socket.emit('order_updated', order);
      console.log('Отправлено');
    } else {
      console.log('Нет активного пользователя');
    }
  }
}
