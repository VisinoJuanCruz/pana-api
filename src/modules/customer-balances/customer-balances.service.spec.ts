import { Test, TestingModule } from '@nestjs/testing';
import { CustomerBalancesService } from './customer-balances.service';

describe('CustomerBalancesService', () => {
  let service: CustomerBalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerBalancesService],
    }).compile();

    service = module.get<CustomerBalancesService>(CustomerBalancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
