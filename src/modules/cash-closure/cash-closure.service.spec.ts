import { Test, TestingModule } from '@nestjs/testing';
import { CashClosureService } from './cash-closure.service';

describe('CashClosureService', () => {
  let service: CashClosureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashClosureService],
    }).compile();

    service = module.get<CashClosureService>(CashClosureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
