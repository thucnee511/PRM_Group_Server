import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product, User } from '.';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  userId: string;

  @Column({
    type: 'int',
    default: 0,
  })
  totalItems: number;

  @Column({
    type: 'int',
    default: 0,
  })
  totalValue: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({
        type: 'uuid',
        length: 36,
        nullable: false,
    })
    cartId: string;
    
    @Column({
        type: 'uuid',
        length: 36,
        nullable: false,
    })
    productId: string;
    
    @Column({
        type: 'int',
        nullable: false,
    })
    quantity: number;
    
    @Column({
        type: 'int',
        nullable: false,
    })
    price: number;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Product, product => product.cartItems)
    product: Product;
}
