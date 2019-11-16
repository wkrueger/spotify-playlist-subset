import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as any;
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
