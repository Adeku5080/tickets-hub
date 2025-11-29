import { Model } from 'objection';

export class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  id!: string;
  email!: string;
  password!: string;
  phone?: string;
  role!: string;
  is_email_verified!: boolean;
  is_phone_verified!: boolean;
  is_active!: boolean;
  last_login_at?: Date;
  created_at!: Date;
  updated_at!: Date;


  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}