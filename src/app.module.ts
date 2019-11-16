import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './api/oai/AuthService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
