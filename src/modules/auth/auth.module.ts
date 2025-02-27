import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/models";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [],
    providers: [
        JwtService,
    ],
})
export class AuthModule{}