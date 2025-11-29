import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserRepository } from 'src/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserResponseInterface } from 'src/interfaces/user-response.interface';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { loginUserDto } from 'src/dtos/login-user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signup(createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const { email, password, name } = createUserDto;

    const checkIfEmailExists = await this.userRepository.findOne({
      where: { email },
    });

    if (checkIfEmailExists) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS),
    );

    const user = await this.userRepository.createUser({
      password: hashedPassword,
      email,
      name,
    });

    return {
      ...user,
      token: this.generateJwt(user),
    };
  }

  async login(loginUserDto: loginUserDto): Promise<UserResponseInterface> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid Credentials,signup',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorreect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorreect) {
      throw new HttpException(
        'Invalid Credentials,signup',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;
    return {
      ...user,
      token: this.generateJwt(user),
    };
  }

  generateJwt(user: User): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
    );
  }
}
