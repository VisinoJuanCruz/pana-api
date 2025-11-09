import { Test, TestingModule } from '@nestjs/testing';
import { CustomerProductPriceController } from './customer-product-price.controller';

describe('CustomerProductPriceController', () => {
  let controller: CustomerProductPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerProductPriceController],
    }).compile();

    controller = module.get<CustomerProductPriceController>(
      CustomerProductPriceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
