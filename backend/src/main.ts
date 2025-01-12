import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS with specific options or defaults
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',  // Replace with your frontend's URL
    credentials: true,                // If you're using cookies or other credentials
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
