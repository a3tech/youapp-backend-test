import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "./rabbitmq.service";

const QUEUE_NAME = 'chat_messages';

@Injectable()
export class RabbitMQProducer {
  constructor(private readonly rabbitMQ: RabbitMQService) {}

  async publish(message: any) {
    console.log('[Producer] publish() called');
    console.log('[Producer] payload:', message);

    // IMPORTANT: wait until RabbitMQ is ready
    await this.rabbitMQ.waitUntilReady();

    const channel = this.rabbitMQ.getChannel();

    const ok = channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );

    console.log('[Producer] sendToQueue result:', ok);
  }
}