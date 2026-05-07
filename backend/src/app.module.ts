import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { databaseConfig } from './config/database.config';
import { CacheModule } from './cache/cache.module';
import { HealthModule } from './health/health.module';
import { SentryExceptionFilter } from './common/filters/sentry-exception.filter';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { SentryModule } from './sentry/sentry.module';
import { UsersModule } from './users/users.module';
import { RealtimeModule } from './websocket/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig()),
    HealthModule,
    AuthModule,
    CacheModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    PaymentsModule,
    RealtimeModule,
    SentryModule
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: SentryInterceptor },
    { provide: APP_FILTER, useClass: SentryExceptionFilter }
  ]
})
export class AppModule {}
