import { Model } from 'objection';
import { User } from './user.model';

export class UserVerification extends Model {
  static get tableName() {
    return 'user_verifications';
  }

  static get idColumn() {
    return 'id';
  }

  id!: string;
  user_id!: string;
  type!: string;
  status!: string;
  document_url?: string;
  submitted_at!: Date;
  reviewed_at?: Date;
  reviewed_by?: string;
  rejection_reason?: string;

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_verifications.user_id',
          to: 'users.id'
        }
      },
      reviewer: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_verifications.reviewed_by',
          to: 'users.id'
        }
      }
    };
  }

  $beforeInsert() {
    this.submitted_at = new Date();
  }
}