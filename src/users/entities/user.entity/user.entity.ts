import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Notification } from 'src/notification/entities/notification.entity';
@Entity()
@Unique(['phone'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  organization: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
