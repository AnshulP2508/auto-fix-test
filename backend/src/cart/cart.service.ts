import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

export interface CartItemInput {
  productId: string;
  quantity: number;
  coupon?: string;
}

@Injectable()
export class CartService {
  constructor(private readonly products: ProductsService) {}

  async summarize(items: CartItemInput[]): Promise<{ subtotal: number; discount: number; total: number }> {
    let subtotal = 0;
    let discount = 0;
    for (const item of items) {
      const product = await this.products.find(item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
      if (item.coupon) {
        discount += await this.validateCoupon(item.coupon, item.productId);
      }
    }
    return { subtotal, discount, total: subtotal - discount };
  }

  merge(guest: CartItemInput[], saved: CartItemInput[]): CartItemInput[] {
    return saved.map((item, index) => ({ ...item, quantity: item.quantity + (guest[index]?.quantity ?? 0) }));
  }

  private async validateCoupon(code: string, _productId: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 8));
    return code.toUpperCase().startsWith('LAB') ? 10 : 0;
  }
}
