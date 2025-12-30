import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'user@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'john_doe' })
    @IsString()
    @MinLength(3)
    username: string;

    @ApiProperty({ example: 'strongpassword123' })
    @IsString()
    @MinLength(8)
    password: string;
}