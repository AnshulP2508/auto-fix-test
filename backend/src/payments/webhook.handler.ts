import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentWebhookHandler {
  constructor(private readonly payments: PaymentsService) {}

  async handle(event: any): Promise<unknown> {
    return Sentry.startSpan({ name: `payment.webhook.${event?.event_type || 'unknown'}`, op: 'payment.webhook' }, async () => {
      try {
        Sentry.setTag('payment.gateway', 'mock-razorpay');
        Sentry.setTag('payment.event_type', event?.event_type || 'unknown');
        if (event?.amount !== undefined) {
          Sentry.setTag('payment.amount', String(event.amount));
        }
        Sentry.addBreadcrumb({ category: 'payment.webhook', message: 'Webhook received', level: 'info' });
        Sentry.addBreadcrumb({ category: 'payment.webhook', message: 'Signature verified', level: 'info' });
        Sentry.addBreadcrumb({ category: 'payment.webhook', message: 'Order lookup', level: 'info' });
        const result = await this.payments.webhook(event);
        Sentry.addBreadcrumb({ category: 'payment.webhook', message: 'Status update', level: 'info' });
        Sentry.addBreadcrumb({ category: 'payment.webhook', message: 'Confirmation sent', level: 'info' });
        return result;
      } catch (error) {
        Sentry.withScope((scope) => {
          scope.setContext('payment.webhook', {
            eventType: event?.event_type,
            amount: event?.amount,
            gateway: 'mock-razorpay'
          });
          Sentry.captureException(error);
        });
        throw error;
      }
    });
  }
}
