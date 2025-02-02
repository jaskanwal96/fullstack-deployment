// src/ssr/ssr.service.ts
import { Injectable } from '@nestjs/common';
import { renderToString } from '@vue/server-renderer';
import { createSSRApp } from 'vue';

@Injectable()
export class SsrService {
  private renderer;

  constructor() {
  }

  async renderVueApp(data: any) {
    // Create the Vue App
    const app = createSSRApp({
      data() {
        return {
          message: data.message,
          count: 0,
        };
      },
      template: `
        <div>
          <h1>{{ message }} {{ count }}</h1>
          <button @click="count++">Incrementor</button>
          <pre>Generated using vue server renderer (SSR)</pre>
        </div>
      `,
    });

    // Render the Vue app to a string
    const html = await renderToString(app);
    return html;
  }
}
