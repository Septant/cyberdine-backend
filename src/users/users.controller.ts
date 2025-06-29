import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: Omit<User, 'id'>): Promise<User> {
    return this.usersService.create(userData);
  }
}
