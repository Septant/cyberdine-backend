import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const existingPhone = await this.userRepository.findOne({
      where: { phone: userData.phone },
    });
    if (existingPhone) {
      throw new BadRequestException(
        'Пользователь с таким телефоном уже существует',
      );
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
