import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async afterInit() {
    // WAIT until RabbitMQ is fully ready
    await this.rabbitMQService.waitUntilReady();

    const channel = this.rabbitMQService.getChannel();

    await channel.consume('chat_messages', (msg) => {
      if (!msg) return;

      console.log('[Consumer] message received');

      const payload = JSON.parse(msg.content.toString());
      console.log('[Consumer] payload:', payload);

      this.server.to(payload.receiverId).emit('newMessage', payload);

      channel.ack(msg);
    });

    console.log('RabbitMQ consumer attached');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      client.join(userId);
    }
  }
}
