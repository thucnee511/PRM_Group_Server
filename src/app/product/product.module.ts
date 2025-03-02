import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category, Product, User } from "src/common/models";
import { ProductController } from "./product.controller";
import { JwtService } from "@nestjs/jwt";
import { ProductService } from "./product.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, User, Category])
    ],
    controllers: [
        ProductController
    ],
    providers: [
        JwtService,
        ProductService
    ]
})
export class ProductModule {
}