import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { User } from './users/entities/user.entity/user.entity';
import { Order } from './order/entities/order.entity';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/entities/notification.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.127.126.32', // или '127.0.0.1'
      port: 3306,
      username: 'root', // пользователь MySQL (по умолчанию в OpenServer)
      password: '', // пароль (если не задан в OpenServer)
      database: 'nest_app', // имя вашей БД (создайте заранее в phpMyAdmin)
      entities: [User, Order, Notification],
      synchronize: true, // Только для разработки!
    }),
    UsersModule,
    AuthModule,
    OrderModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
