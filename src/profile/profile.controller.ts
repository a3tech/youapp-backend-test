import { Body, Controller, Get, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadConfig } from 'src/config/multer.config';

@ApiTags('Profile')
@ApiBearerAuth('access-token')
@ApiExtraModels(CreateProfileDto, UpdateProfileDto)
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiExtraModels(CreateProfileDto)
    @ApiBody({
    schema: {
        allOf: [
            { $ref: getSchemaPath(CreateProfileDto) },
            {
                type: 'object',
                properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
                },
            },
        ],
    },
    })
    @UseInterceptors(FileInterceptor('image', imageUploadConfig))
    create(
        @Req() req,
        @Body() dto: CreateProfileDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.profileService.create(req.user.userId, dto, file);
    }

    @Get()
    get(@Req() req) {
        return this.profileService.findByUser(req.user.userId);
    }

    @Put()
    @ApiConsumes('multipart/form-data')
    @ApiExtraModels(UpdateProfileDto)
    @ApiBody({
        schema: {
            allOf: [
                { $ref: getSchemaPath(UpdateProfileDto) },
                {
                    type: 'object',
                    properties: {
                    image: {
                        type: 'string',
                        format: 'binary',
                    },
                    },
                },
            ],
        },
    })
    @UseInterceptors(FileInterceptor('image', imageUploadConfig))
    update(
        @Req() req,
        @Body() dto: UpdateProfileDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.profileService.update(req.user.userId, dto, file);
    }
}
