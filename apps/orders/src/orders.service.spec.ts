import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';

const mockOrderRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

const mockClientProxy = () => ({
  send: jest.fn(),
});

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: ReturnType<typeof mockOrderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useFactory: mockOrderRepository,
        },
        {
          provide: 'ORDERS_SERVICE',
          useFactory: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repo = module.get(getRepositoryToken(Order));
  });

  describe('create()', () => {
    it('should create and save an order', async () => {
      const userId = 'user123';
      const dto = { title: 'Book', description: "Hello", price: 2 };

      const createdOrder = { ...dto, userId };
      repo.create.mockReturnValue(createdOrder);
      repo.save.mockResolvedValue({ id: 'order1', ...createdOrder });

      const result = await service.create(userId, dto);

      expect(repo.create).toHaveBeenCalledWith({ ...dto, userId });
      expect(repo.save).toHaveBeenCalledWith(createdOrder);
      expect(result).toHaveProperty('id', 'order1');
    });
  });

  describe('getOrdersByUserId()', () => {
    it('should return orders for the given user ID', async () => {
      const userId = 'user123';
      const orders = [
        { id: '1', userId, product: 'Book', createdAt: new Date() },
        { id: '2', userId, product: 'Pen', createdAt: new Date() },
      ];

      repo.find.mockResolvedValue(orders);

      const result = await service.getOrdersByUserId(userId);

      expect(repo.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(orders);
    });
  });
});
