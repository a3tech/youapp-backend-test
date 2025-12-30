import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqplib';
import type { Channel, Connection } from 'amqplib';

jest.mock('amqplib');

describe('RabbitMQService (Unit)', () => {
    let service: RabbitMQService;

    const mockChannel: Partial<Channel> = {
        assertQueue: jest.fn(),
    };

    const mockConnection: Partial<Connection> = {
        createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    beforeEach(async () => {
        jest.spyOn(amqp, 'connect').mockResolvedValue(
        mockConnection as Connection,
        );

        const module: TestingModule = await Test.createTestingModule({
        providers: [RabbitMQService],
        }).compile();

        service = module.get(RabbitMQService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect and create channel on module init', async () => {
        await service.onModuleInit();

        expect(amqp.connect).toHaveBeenCalled();
        expect(mockConnection.createChannel).toHaveBeenCalled();
        expect(mockChannel.assertQueue).toHaveBeenCalledWith(
        'chat_messages',
        { durable: true },
        );
    });

    it('should resolve waitUntilReady after init', async () => {
        await service.onModuleInit();

        await expect(service.waitUntilReady()).resolves.toBeUndefined();
    });

    it('should return channel when ready', async () => {
        await service.onModuleInit();

        const channel = service.getChannel();

        expect(channel).toBe(mockChannel);
    });

    it('should throw error if channel not ready', () => {
        expect(() => service.getChannel()).toThrow(
        'RabbitMQ channel not ready',
        );
    });

    it('should retry and throw if connection fails', async () => {
        jest
            .spyOn(amqp, 'connect')
            .mockRejectedValue(new Error('Connection failed'));

        // Spy on private method and force fast retry
        const retrySpy = jest
            .spyOn(
            RabbitMQService.prototype as any,
            'connectWithRetry',
            )
            .mockImplementation(async () => {
            throw new Error('RabbitMQ connection failed');
            });

        const service = new RabbitMQService();

        await expect(service.onModuleInit()).rejects.toThrow(
            'RabbitMQ connection failed',
        );

        expect(retrySpy).toHaveBeenCalled();
    });
});