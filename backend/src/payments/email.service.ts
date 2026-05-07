import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendReceipt(email: string, orderId: string): Promise<void> {
    if (email.includes('fail')) {
      throw new Error(`receipt failed for ${orderId}`);
    }
  }
}
