import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private knex: Knex;

  async onModuleInit() {
    this.knex = require('knex')(knexConfig);
    Model.knex(this.knex);
  }

  async onModuleDestroy() {
    await this.knex.destroy();
  }

  getKnex(): Knex {
    return this.knex;
  }
}