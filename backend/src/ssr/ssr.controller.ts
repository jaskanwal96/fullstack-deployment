import { Controller, Get } from '@nestjs/common';
import { SsrService } from './ssr.service';
import { MockService } from 'src/mock/mock.service';

@Controller('ssr')
export class SsrController {
    constructor(
        private readonly ssrService: SsrService,
        private readonly mockApiService: MockService,
    ){}

    @Get('*')
    async handleSsr() {
    // Fetch the mock data
    const data = await this.mockApiService.getMockData();
    
    // Render the Vue app with mock data
    const html = await this.ssrService.renderVueApp(data);

    // Serve the HTML with a basic template
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>SSR with NestJS</title>
        </head>
        <body>
          <div id="app">${html}</div>
          <script src="/frontend/assets/index-DLA3BMjq.js"></script>
          <link rel="stylesheet" crossorigin href="/frontend/assets/index-B801AMSS.css">
        </body>
      </html>
    `;
    }
}
