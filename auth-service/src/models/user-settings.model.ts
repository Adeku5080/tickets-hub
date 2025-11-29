import { Model } from 'objection';
import { User } from './user.model';

export class UserSettings extends Model {
  static get tableName() {
    return 'user_settings';
  }

  static get idColumn() {
    return 'user_id';
  }

  user_id!: string;
  language!: string;
  currency!: string;
  distance_unit!: string;
  default_search_radius!: number;
  email_marketing!: boolean;
  email_reminders!: boolean;
  push_enabled!: boolean;
  sms_enabled!: boolean;
  favorite_categories!: string[];
  updated_at!: Date;

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_settings.user_id',
          to: 'users.id'
        }
      }
    };
  }

  $beforeInsert() {
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}