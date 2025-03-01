import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order, User } from "src/common/models";
import { UserService } from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Order])
    ],
    controllers: [
        UserController
    ],
    providers: [
        JwtService,
        UserService
    ]
})
export class UserModule {}