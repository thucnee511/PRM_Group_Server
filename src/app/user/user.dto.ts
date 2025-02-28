import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserRequestDto {
    @ApiProperty()
    fullname?: string;
    @ApiProperty()
    phoneNumber?: string;
    @ApiProperty()
    avatar?: string;
}