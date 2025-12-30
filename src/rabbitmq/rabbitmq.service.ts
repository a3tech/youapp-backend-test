import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import type { Channel, Connection } from 'amqplib';

const QUEUE_NAME = 'chat_messages';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection!: Connection;
  private channel!: Channel;

  private readyResolver!: () => void;
  private readyPromise = new Promise<void>((res) => {
    this.readyResolver = res;
  });

  async onModuleInit() {
    await this.connectWithRetry();
    this.readyResolver(); // signal ready
  }

  private async connectWithRetry(retries = 10, delay = 3000) {
    while (retries > 0) {
      try {
        this.connection = await amqp.connect(
          process.env.RABBITMQ_URL as string,
        );

        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log('RabbitMQ connected');
        return;
      } catch (err) {
        retries--;
        console.log(`RabbitMQ retrying... (${retries})`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error('RabbitMQ connection failed');
  }

  async waitUntilReady() {
    await this.readyPromise;
  }

  getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not ready');
    }
    return this.channel;
  }
}