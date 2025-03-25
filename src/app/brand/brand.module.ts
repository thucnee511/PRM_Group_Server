import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand, Category, User } from "src/common/models";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Category, User])],
    providers: [BrandService, JwtService],
    controllers: [BrandController],
})
export class BrandModule {}