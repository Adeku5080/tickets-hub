import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/currentUser')
  public getCurrentUser(): string {
    return 'this is the current user controller';
  }
}
