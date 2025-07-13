import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { loginUserDto } from 'src/dtos/login-user.dto';
import { UserResponseInterface } from 'src/interfaces/user-response.interface';
import { UserService } from 'src/services/user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  async signup(@Body() dto: CreateUserDto): Promise<UserResponseInterface> {
    const data = await this.userService.signup(dto);

    return {
      name: data.name,
      email: data.email,
      token: data.token,
    };
  }

  @Post('login')
  async login(@Body() dto: loginUserDto) {
    const data = await this.userService.login(dto);
    return {
      name: data.name,
      email: data.email,
      token: data.token,
    };
  }
}
