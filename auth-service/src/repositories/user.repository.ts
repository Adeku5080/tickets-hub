import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUser } from 'src/interfaces/user-response.interface';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(datasource: DataSource) {
    super(User, datasource.createEntityManager());
  }

  async findUserByEmailOrusername(identifier: string): Promise<User | null> {
    return this.findOne({
      where: [{ email: identifier }],
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.findOne({ where: { id: userId } });
  }

  async createUser(userData: CreateUser): Promise<User> {
    return this.save(userData);
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<void> {
    await this.update(userId, updateData);
  }
}
