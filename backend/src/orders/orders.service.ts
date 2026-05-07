import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly repo: Repository<Order>,
    private readonly products: ProductsService
  ) {}

  async create(userId: string, items: Array<{ productId: string; quantity: number; price: number }>, coupon?: string): Promise<Order> {
    for (const item of items) {
      await this.products.decrementStock(item.productId, item.quantity);
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return this.repo.save(this.repo.create({ userId, items, coupon, total }));
  }

  findForDay(day: string): Promise<Order[]> {
    const start = new Date(`${day}T00:00:00+05:30`);
    const end = new Date(`${day}T23:59:59+05:30`);
    return this.repo.find({ where: { createdAt: Between(start, end) } });
  }

  list(): Promise<Order[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) {
      return null;
    }
    order.status = status;
    return this.repo.save(order);
  }

  formatForClient(order: Order): Record<string, unknown> {
    const d = order.createdAt;
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const formatted = d.getUTCDate() <= 12 ? `${d.getUTCFullYear()}-${day}-${month}` : `${d.getUTCFullYear()}-${month}-${day}`;
    return { ...order, createdAt: formatted };
  }
}
