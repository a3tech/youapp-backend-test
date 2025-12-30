import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { calculateHoroscope } from 'src/utils/horoscope.util';
import { calculateZodiac } from 'src/utils/zodiac.util';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel(Profile.name)
        private profileModel: Model<Profile>,
    ) {}

    async create(
        userId: string,
        dto: CreateProfileDto,
        file?: Express.Multer.File,
    ) {
        const birthday = new Date(dto.birthday);

        return this.profileModel.create({
            ...dto,
            userId,
            image: file?.filename,
            birthday,
            horoscope: calculateHoroscope(birthday),
            zodiac: calculateZodiac(birthday),
        });
    }

    async findByUser(userId: string) {
        const profile = await this.profileModel.findOne({ userId });
        if (!profile) throw new NotFoundException('Profile not found');
        return profile;
    }

    async update(
        userId: string,
        dto: UpdateProfileDto,
        file?: Express.Multer.File,
    ) {
        const profile = await this.findByUser(userId);

        const updateData: Partial<Profile> = {};

        if (file) {
            updateData.image = file.filename;
        }

        if (dto.displayName !== undefined) updateData.displayName = dto.displayName;
        if (dto.gender !== undefined) updateData.gender = dto.gender;
        if (dto.height !== undefined) updateData.height = dto.height;
        if (dto.weight !== undefined) updateData.weight = dto.weight;

        if (dto.birthday) {
            const birthday = new Date(dto.birthday);
            updateData.birthday = birthday;
            updateData.horoscope = calculateHoroscope(birthday);
            updateData.zodiac = calculateZodiac(birthday);
        }

        Object.assign(profile, updateData);
        return profile.save();
    }
}
