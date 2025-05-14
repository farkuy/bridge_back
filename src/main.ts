import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(PORT, () => console.log(`Server start on ${PORT} port`));
}

bootstrap();
