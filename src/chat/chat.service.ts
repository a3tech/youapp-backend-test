import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './schemas/chat-room.schema';
import { Model, Types } from 'mongoose';
import { Message } from './schemas/message.schema';
import { RabbitMQProducer } from '../rabbitmq/rabbitmq.producer';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(ChatRoom.name) private roomModel: Model<ChatRoom>,
        @InjectModel(Message.name) private messageModel: Model<Message>,
        private rabbitProducer: RabbitMQProducer,
    ) {}

    private buildRoomKey(userA: string, userB: string): string {
        return [userA, userB].sort().join('_');
    }


    async getOrCreateRoom(userA: string, userB: string) {
        const roomKey = this.buildRoomKey(userA, userB);

        let room = await this.roomModel.findOne({ roomKey });
        if (!room) {
            room = await this.roomModel.create({
                participants: [
                    new Types.ObjectId(userA),
                    new Types.ObjectId(userB),
                ],
                roomKey,
            });
        }

        return room;
    }

    async sendMessage(senderId: string, receiverId: string, content: string) {
        const room = await this.getOrCreateRoom(senderId, receiverId);

        const message = await this.messageModel.create({
            roomId: room._id,
            senderId,
            receiverId,
            content,
        });

        room.lastMessage = {
            messageId: message._id,
            content,
            senderId: new Types.ObjectId(senderId),
            sentAt: new Date(),
        };
        await room.save();

        await this.rabbitProducer.publish({
            roomId: room._id,
            senderId,
            receiverId,
            content,
        });

        return message;
    }

    async viewMessages(userA: string, userB: string) {
        const roomKey = this.buildRoomKey(userA, userB);
        const room = await this.roomModel.findOne({ roomKey });
        if (!room) return [];

        return this.messageModel
            .find({ roomId: room._id })
            .sort({ createdAt: 1 });
    }
}
