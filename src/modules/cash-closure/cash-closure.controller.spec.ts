import { Test, TestingModule } from '@nestjs/testing';
import { CashClosureController } from './cash-closure.controller';

describe('CashClosureController', () => {
  let controller: CashClosureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashClosureController],
    }).compile();

    controller = module.get<CashClosureController>(CashClosureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
