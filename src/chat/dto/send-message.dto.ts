import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString, MaxLength } from "class-validator";

export class SendMessageDto {
    @ApiProperty({ example: '64b123abc...' })
    @IsMongoId()
    receiverId: string;

    @ApiProperty({ example: 'Hello there!' })
    @IsString()
    @MaxLength(1000)
    content: string;
}