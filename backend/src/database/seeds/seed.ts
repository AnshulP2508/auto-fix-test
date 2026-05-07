import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../../config/database.config';
import { Product } from '../../products/product.entity';
import { User } from '../../users/user.entity';

async function seed(): Promise<void> {
  const ds = await new DataSource(databaseConfig() as any).initialize();
  await ds.getRepository(Product).save([
    { name: 'Lab Mug', price: 199.1, stock: 1, category: 'Training', variants: [{ sku: 'MUG', price: 199.1 }], featured: true },
    { name: 'Debug Hoodie', price: 799.2, stock: 5, category: 'Training', variants: [{ sku: 'HOOD', price: 799.2 }] },
    { name: 'Ghost Product', price: 49.99, stock: 0, category: 'Hidden', deletedAt: new Date() }
  ]);
  await ds.getRepository(User).save({ email: 'admin@lab.test', username: 'admin', passwordHash: '$2b$10$KYVbZ5JFVfqu0oV98LnF5.JfEunBZbH9NYYkV2YiCQK1wkh4NPydy', role: 'admin' });
  await ds.destroy();
}

void seed();
