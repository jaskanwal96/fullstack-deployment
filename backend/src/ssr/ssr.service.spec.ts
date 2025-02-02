import { Test, TestingModule } from '@nestjs/testing';
import { SsrService } from './ssr.service';

describe('SsrService', () => {
  let service: SsrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SsrService],
    }).compile();

    service = module.get<SsrService>(SsrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
