import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class ChatRoom extends Document {

    @Prop({ type: [Types.ObjectId], ref: 'User', index: true })
    participants: Types.ObjectId[];

    @Prop({ unique: true })
    roomKey: string;

    @Prop({
        type: {
            messageId: Types.ObjectId,
            content: String,
            senderId: Types.ObjectId,
            sentAt: Date
        }
    })
    lastMessage?: {
        messageId: Types.ObjectId;
        content: string;
        senderId: Types.ObjectId;
        sentAt: Date;
    }
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);