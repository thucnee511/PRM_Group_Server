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

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    length: 36,
    nullable: false,
    unique: true,
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

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];
}

@Entity('cart_items')
export class CartItem {
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

    @ManyToOne(() => Cart, cart => cart.cartItems)
    cart: Cart;

    @ManyToOne(() => Product, product => product.cartItems)
    product: Product;
}
