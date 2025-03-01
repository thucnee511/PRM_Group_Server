import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category, User } from "src/common/models";
import { CategoryController } from "./category.controller";
import { JwtService } from "@nestjs/jwt";
import { CategoryService } from "./category.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, User])
    ],
    controllers: [
        CategoryController
    ],
    providers: [
        JwtService,
        CategoryService
    ]
})
export class CategoryModule{

}