import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQProducer } from './rabbitmq.producer';

@Module({
  providers: [RabbitMQService, RabbitMQProducer],
  exports: [RabbitMQService, RabbitMQProducer],
})
export class RabbitMQModule {}
