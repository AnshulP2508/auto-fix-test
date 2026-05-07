import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: 'customer' })
  role!: 'customer' | 'admin';

  @Column({ default: 0 })
  tokenVersion!: number;

  @Column({ default: false })
  oauthUser!: boolean;
}
