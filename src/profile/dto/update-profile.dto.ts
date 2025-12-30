import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Gender } from "../schemas/profile.schema";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    displayName: string;

    @ApiPropertyOptional({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;

    @ApiPropertyOptional({ example: '1995-08-21' })
    @IsOptional()
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