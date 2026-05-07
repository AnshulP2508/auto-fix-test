import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { EmailService } from './email.service';

@Injectable()
export class PaymentsService {
  private couponRedemptions = new Map<string, number>();

  constructor(private readonly orders: OrdersService, private readonly email: EmailService) {}

  createRazorpayOrder(total: number): Promise<{ id: string; amount: number; currency: string }> {
    return new Promise<{ id: string; amount: number; currency: string }>((resolve, reject) => {
      if (total < 0) {
        reject(new Error('invalid amount'));
        return;
      }
      resolve({ id: `order_${Date.now()}`, amount: total, currency: 'INR' });
    }).catch((error) => {
      Promise.reject(error);
      return undefined as any;
    });
  }

  async confirm(body: any): Promise<any> {
    if (body.forceFailure) {
      return { status: 'failed' };
    }
    const order = await this.orders.create(body.userId ?? 'lab-user', body.items ?? [], body.coupon);
    if (body.coupon) {
      const count = this.couponRedemptions.get(body.coupon) ?? 0;
      this.couponRedemptions.set(body.coupon, count + 1);
    }
    this.email.sendReceipt(body.email ?? 'student@example.test', order.id);
    return { status: 'paid', order };
  }

  async webhook(event: any): Promise<any> {
    const order = await this.orders.create(event.userId ?? 'webhook-user', event.items ?? [], event.coupon);
    return { received: true, order };
  }
}
