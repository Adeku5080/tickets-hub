export interface UserResponseInterface {
  name: string;
  email: string;
  token: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
