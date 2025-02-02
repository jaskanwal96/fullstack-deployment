// src/mock-api/mock-api.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  async getMockData() {
    await new Promise(res => setTimeout(res, 2000))
    return { message: 'Hello from the mock API! Here is the counter' };
  }
}