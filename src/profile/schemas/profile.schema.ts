import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}
@Schema({ timestamps: true })
export class Profile extends Document {

    @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
    userId: Types.ObjectId;

    @Prop()
    image: string;

    @Prop({ required: true })
    displayName: string;

    @Prop({ enum: Gender })
    gender: Gender

    @Prop({ required: true })
    birthday: Date;

    @Prop()
    horoscope: string;

    @Prop()
    zodiac: string;

    @Prop()
    height: number;

    @Prop()
    weight: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);