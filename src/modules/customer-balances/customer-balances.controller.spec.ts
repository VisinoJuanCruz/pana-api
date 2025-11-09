import { Test, TestingModule } from '@nestjs/testing';
import { CustomerBalancesController } from './customer-balances.controller';

describe('CustomerBalancesController', () => {
  let controller: CustomerBalancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerBalancesController],
    }).compile();

    controller = module.get<CustomerBalancesController>(CustomerBalancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
