import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentWebhookHandler } from './webhook.handler';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService, private readonly webhookHandler: PaymentWebhookHandler) {}

  @Post('mock-razorpay/order')
  create(@Body('total') total: number) {
    return this.payments.createRazorpayOrder(total);
  }

  @Post('confirm')
  confirm(@Body() body: any) {
    return this.payments.confirm(body);
  }

  @Post('webhook')
  webhook(@Body() body: any) {
    return this.webhookHandler.handle(body);
  }
}
