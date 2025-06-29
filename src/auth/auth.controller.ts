import { Body, Controller, Delete, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('email') email: string) {
    return {
      email: await this.authService.login(email),
    };
  }

  @Delete('logout')
  async logout(@Headers('x-user-email') email: string) {
    return this.authService.logout(email);
  }
}
