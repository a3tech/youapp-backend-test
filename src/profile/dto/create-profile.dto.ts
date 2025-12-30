import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "../schemas/profile.schema";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateProfileDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    displayName: string;

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({ example: '1995-08-21' })
    @IsDateString()
    birthday: string; //ISO String

    @ApiPropertyOptional({ example: 170})
    @IsOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    height?: number;

    @ApiPropertyOptional({ example: 65})
    @IsOptional()
    @Transform(({ value }) => value !== undefined ? Number(value) : value)
    @IsNumber()
    weight?: number;
}