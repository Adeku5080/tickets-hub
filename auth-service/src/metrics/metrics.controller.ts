// src/metrics/metrics.controller.ts

import * as client from 'prom-client';
import { Controller, Get } from '@nestjs/common';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

@Controller('metrics')
export class MetricsController {
  @Get()
  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
