import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { loginUserDto } from 'src/dtos/login-user.dto';
import { UserResponseInterface } from 'src/interfaces/user-response.interface';
import {AuthService } from 'src/services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async signup(@Body() dto: CreateUserDto): Promise<UserResponseInterface> {
    const data = await this.authService.signup(dto);

    return {
      name: data.name,
      email: data.email,
      token: data.token,
    };
  }

  @Post('login')
  async login(@Body() dto: loginUserDto) {
    const data = await this.authService.login(dto);
    return {
      name: data.name,
      email: data.email,
      token: data.token,
    };
  }
}
