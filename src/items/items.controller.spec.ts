import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller.js';
import { ItemsService } from './items.service.js';

describe('ItemsController', () => {
  let controller: ItemsController;
  let fakeItemsService: Partial<ItemsService>;

  beforeEach(async () => {
    fakeItemsService = {
      getAllItems: () => Promise.resolve([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: fakeItemsService,
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
