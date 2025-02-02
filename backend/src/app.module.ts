import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SsrService } from './ssr/ssr.service';
import { SsrController } from './ssr/ssr.controller';
import { MockService } from './mock/mock.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: determineEnvFilePath(),
    })
  ],
  controllers: [AppController, SsrController],
  providers: [AppService, SsrService, MockService],
})
export class AppModule {}

function determineEnvFilePath(): string {
  const environment = process.env.NODE_ENV || 'development';
  return `.env.${environment}`;
}
