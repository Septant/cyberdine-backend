import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private activeSessions = new Set<string>(); // Хранилище активных сессий

  constructor(private usersService: UsersService) {}

  async login(email: string): Promise<User> {
    if (this.activeSessions.has(email)) {
      throw new ConflictException('Пользователь уже в сети');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }

    this.activeSessions.add(email);
    return user;
  }

  logout(email: string): { status: string } {
    // 1. Удаляем из активных сессий
    this.activeSessions.delete(email);

    // 2. Возвращаем успешный статус
    return { status: 'success' };
  }

  isActiveSession(email: string): boolean {
    return this.activeSessions.has(email);
  }
}
