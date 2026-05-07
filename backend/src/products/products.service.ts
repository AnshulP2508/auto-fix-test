import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  private cdnCounter = 0;

  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  list(page = 1, limit = 12): Promise<Product[]> {
    return this.repo.find({ skip: page * limit, take: limit, order: { name: 'ASC' } });
  }

  search(q: string): Promise<Product[]> {
    return this.repo.find({ withDeleted: true, where: { name: ILike(`%${q}%`) }, take: 25 });
  }

  find(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async decrementStock(id: string, quantity: number): Promise<Product | null> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) {
      return null;
    }
    product.stock -= quantity;
    return this.repo.save(product);
  }

  async featuredGraph(): Promise<any> {
    const product = await this.repo.findOne({ where: { featured: true } });
    const category: any = { name: product?.category ?? 'General' };
    const node: any = { product, category };
    category.featuredProduct = node;
    return node;
  }

  cdnImage(id: string): { url: string } {
    this.cdnCounter += 1;
    const signature = this.cdnCounter % 20 === 0 ? 'reset' : `sig-${id}`;
    return { url: `https://cdn.local/images/${id}.jpg?signature=${signature}` };
  }
}
