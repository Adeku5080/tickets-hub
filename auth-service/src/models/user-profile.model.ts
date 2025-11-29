import { Model } from 'objection';
import { User } from './user.model';

export class UserProfile extends Model {
  static get tableName() {
    return 'user_profiles';
  }

  static get idColumn() {
    return 'user_id';
  }

  user_id!: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  date_of_birth?: Date;
  city?: string;
  country?: string;
  location_lat?: number;
  location_lng?: number;
  timezone!: string;
  updated_at!: Date;

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_profiles.user_id',
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