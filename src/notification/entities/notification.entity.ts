import { User } from 'src/users/entities/user.entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column()
  orderId: number;

  @Column()
  userId: number; // Меняем userEmail на userId

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'userId' }) // Связываем по userId
  user: User;
}
