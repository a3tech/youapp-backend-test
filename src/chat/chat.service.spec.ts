import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chat-room.schema';
import { Message } from './schemas/message.schema';
import { RabbitMQProducer } from '../rabbitmq/rabbitmq.producer';
import { Model, Types } from 'mongoose';

describe('ChatService (Unit)', () => {
  let service: ChatService;
  let roomModel: jest.Mocked<Model<ChatRoom>>;
  let messageModel: jest.Mocked<Model<Message>>;
  let rabbitProducer: jest.Mocked<RabbitMQProducer>;

  const userA = '64f000000000000000000001';
  const userB = '64f000000000000000000002';

  const mockRoom = {
    _id: new Types.ObjectId(),
    roomKey: `${userA}_${userB}`,
    participants: [new Types.ObjectId(userA), new Types.ObjectId(userB)],
    lastMessage: null,
    save: jest.fn(),
  };

  const mockMessage = {
    _id: new Types.ObjectId(),
    roomId: mockRoom._id,
    senderId: userA,
    receiverId: userB,
    content: 'Hello',
    createdAt: new Date(),
  };

  const roomModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const messageModelMock = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const rabbitProducerMock = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(ChatRoom.name),
          useValue: roomModelMock,
        },
        {
          provide: getModelToken(Message.name),
          useValue: messageModelMock,
        },
        {
          provide: RabbitMQProducer,
          useValue: rabbitProducerMock,
        },
      ],
    }).compile();

    service = module.get(ChatService);
    roomModel = module.get(getModelToken(ChatRoom.name));
    messageModel = module.get(getModelToken(Message.name));
    rabbitProducer = module.get(RabbitMQProducer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return existing room if found', async () => {
    roomModel.findOne.mockResolvedValue(mockRoom as any);

    const room = await service.getOrCreateRoom(userA, userB);

    expect(roomModel.findOne).toHaveBeenCalled();
    expect(roomModel.create).not.toHaveBeenCalled();
    expect(room).toEqual(mockRoom);
  });

  it('should create room if not exists', async () => {
    roomModel.findOne.mockResolvedValue(null);
    roomModel.create.mockResolvedValue(mockRoom as any);

    const room = await service.getOrCreateRoom(userA, userB);

    expect(roomModel.create).toHaveBeenCalledWith({
      participants: [
        new Types.ObjectId(userA),
        new Types.ObjectId(userB),
      ],
      roomKey: `${userA}_${userB}`,
    });
    expect(room).toEqual(mockRoom);
  });

  it('should send message and publish event', async () => {
    roomModel.findOne.mockResolvedValue(mockRoom as any);
    messageModel.create.mockResolvedValue(mockMessage as any);

    await service.sendMessage(userA, userB, 'Hello');

    expect(messageModel.create).toHaveBeenCalledWith({
      roomId: mockRoom._id,
      senderId: userA,
      receiverId: userB,
      content: 'Hello',
    });

    expect(mockRoom.save).toHaveBeenCalled();

    expect(rabbitProducer.publish).toHaveBeenCalledWith({
      roomId: mockRoom._id,
      senderId: userA,
      receiverId: userB,
      content: 'Hello',
    });
  });

  it('should return messages if room exists', async () => {
    roomModel.findOne.mockResolvedValue(mockRoom as any);

    const sortMock = jest.fn().mockResolvedValue([mockMessage]);
    messageModel.find.mockReturnValue({ sort: sortMock } as any);

    const messages = await service.viewMessages(userA, userB);

    expect(messageModel.find).toHaveBeenCalledWith({ roomId: mockRoom._id });
    expect(messages).toEqual([mockMessage]);
  });

  it('should return empty array if room not found', async () => {
    roomModel.findOne.mockResolvedValue(null);

    const messages = await service.viewMessages(userA, userB);

    expect(messages).toEqual([]);
    expect(messageModel.find).not.toHaveBeenCalled();
  });
});