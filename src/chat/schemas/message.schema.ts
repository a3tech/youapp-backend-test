import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read'
}

@Schema({ timestamps: true })
export class Message extends Document {

    @Prop({ type: Types.ObjectId, ref: 'ChatRoom', index: true })
    roomId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    senderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    receiverId: Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ default: MessageStatus.SENT })
    status: MessageStatus;
}

export const MessageSchema = SchemaFactory.createForClass(Message);