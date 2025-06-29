import { User } from 'src/users/entities/user.entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column()
  fullName: string;

  @Column()
  organization: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  reason: string;

  @Column()
  expirationDate: string;

  @Column({
    type: 'enum',
    enum: [
      'в обработке',
      'на согласовании',
      'пропуск готов',
      'отклонена',
      'пропуск выдан',
    ],
    default: 'в обработке',
  })
  status: string;

  @Column()
  notify: boolean;

  @Column()
  userId: number; // Изменили userEmail на userId

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' }) // Связываем по userId
  user: User;
}
