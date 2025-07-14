import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { ormConfig } from './ormconfig';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UserModule, MetricsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
