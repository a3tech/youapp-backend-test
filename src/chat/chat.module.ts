import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-room.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { RabbitMQProducer } from '../rabbitmq/rabbitmq.producer';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    RabbitMQModule
  ],
  controllers: [ChatController],
  providers: [ChatService, RabbitMQProducer, ChatGateway],
})
export class ChatModule {}
