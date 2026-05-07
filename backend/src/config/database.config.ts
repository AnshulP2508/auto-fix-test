import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { QueryMonitoringSubscriber } from '../database/query-monitoring.subscriber';

import * as dotenv from 'dotenv';
dotenv.config();

export function databaseConfig(): TypeOrmModuleOptions {
  const url = process.env.PROD_DB_URL || process.env.DEV_DB_URL || 'postgres://lab:lab@localhost:5432/lab';
  return {
    type: 'postgres',
    url,
    entities: [User, Product, Order],
    subscribers: [QueryMonitoringSubscriber],
    synchronize: true
  };
}
