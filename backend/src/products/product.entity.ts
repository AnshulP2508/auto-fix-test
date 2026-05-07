import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('float')
  price!: number;

  @Column({ default: 0 })
  stock!: number;

  @Column({ default: 'General' })
  category!: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  variants!: Array<{ sku: string; price: number }>;

  @Column({ default: false })
  featured!: boolean;

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
