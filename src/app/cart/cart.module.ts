import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart, CartItem, User } from "src/common/models";
import { CartController } from "./cart.controller";
import { JwtService } from "@nestjs/jwt";
import { CartService } from "./cart.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Cart, CartItem])
    ],
    controllers: [
        CartController
    ],
    providers: [
        JwtService,
        CartService
    ],
})
export class CartModule {
}