import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem, Category } from '.';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageUrl?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}
