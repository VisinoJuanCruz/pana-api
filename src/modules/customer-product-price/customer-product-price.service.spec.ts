import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProductPriceService } from './customer-product-price.service';

describe('CustomerProductPriceService', () => {
  let service: CustomerProductPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerProductPriceService],
    }).compile();

    service = module.get<CustomerProductPriceService>(
      CustomerProductPriceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
