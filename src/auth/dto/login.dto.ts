import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        example: 'john_doe or john@email.com',
    })
    @IsString()
    identifier: string;

    @ApiProperty({ example: 'strongpassword123' })
    @IsString()
    @MinLength(8)
    password: string;
}