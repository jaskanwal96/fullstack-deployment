import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: determineEnvFilePath(),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function determineEnvFilePath(): string {
  const environment = process.env.NODE_ENV || 'development';
  return `.env.${environment}`;
}
