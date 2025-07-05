import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Enable CORS with specific options or defaults
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') ?? 'http://localhost:5173', // Replace with your frontend's URL
    credentials: true, // If you're using cookies or other credentials
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(configService.get('PORT') ?? 9000);
}
bootstrap();
