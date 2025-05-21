import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Bridge')
    .setDescription('Тестовый проект для риал тайма')
    .setVersion('1.0')
    .addTag('bridge')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, () => console.log(`Server start on ${PORT} port`));
}

bootstrap();
