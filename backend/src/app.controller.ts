import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as os from 'os';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/message')
  getMessage() {
    return { message: this.appService.getMessage() };
  }

  @Get()
  getPodHostname(): string {
    return `Handled by pod: ${os.hostname()}`;
  }
}
