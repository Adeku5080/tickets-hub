import 'dotenv/config';
import { connect } from 'http2';
import * as process from 'process';
import { AppEnvironment } from 'src/enums/generic.enum';

const app = {
  name: 'Pocket Merchant API Service',
  bankName: (process.env.BANK_NAME as string) || 'POCKET APP',
  pocketMerchantId: Number(process.env.SYSTEM_POCKET_ID),
  inProduction: process.env.NODE_ENV === AppEnvironment.Production,
  url: process.env.APP_URL as string,
  env: process.env.NODE_ENV as AppEnvironment,
  storage: {
    bucketName: (process.env.STORAGE_BUCKET_NAME as string) || 'pocket-merchant',
  },
  server: {
    port: Number(process.env.PORT) || 4000,
    address: process.env.SERVER_ADDRESS || '0.0.0.0',
    bodyParserSize: process.env.BODY_PARSER_SIZE || '5MB',
  },
  connections: {
    knex: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER as string,
        password: process.env.DB_PASS as string,
        database: process.env.DB_NAME as string,
        typeCast: (field: any, next: () => void) => {
          if (field.type === 'TINY' && field.length === 1) {
            return field.string() === '1';
          }
          return next();
        },
      },
      pool: {
        min: 2,
        max: 10,
      },
    },
    redis: {
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD as string,
      username: process.env.REDIS_USERNAME as string,
    },
    smtp: {
      from: process.env.SMTP_FROM as string,
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER as string,
      password: process.env.SMTP_PASSWORD as string,
    },
  },

};

export default app;
