import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart, CartItem, Order, OrderItem, Product, User } from "src/common/models";
import { OrderController } from "./order.controller";
import { JwtService } from "@nestjs/jwt";
import { OrderService } from "./order.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Order, OrderItem, Product, Cart, CartItem]),
    ],
    controllers: [
        OrderController
    ],
    providers: [
        JwtService,
        OrderService
    ]
})
export class OrderModule {}