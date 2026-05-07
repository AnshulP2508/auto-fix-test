import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { EmailService } from './email.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentWebhookHandler } from './webhook.handler';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, EmailService, PaymentWebhookHandler]
})
export class PaymentsModule {}
