import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column('jsonb')
  items!: Array<{ productId: string; quantity: number; price: number }>;

  @Column('float')
  total!: number;

  @Column({ default: 'pending' })
  status!: 'pending' | 'paid' | 'failed' | 'shipped' | 'refunded';

  @Column({ nullable: true })
  coupon?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
