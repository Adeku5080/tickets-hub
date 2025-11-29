import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { MetricsModule } from './metrics/metrics.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, UserModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
