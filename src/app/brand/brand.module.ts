import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand, Category } from "src/common/models";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Brand, Category])],
    providers: [BrandService],
    controllers: [BrandController],
})
export class BrandModule {}