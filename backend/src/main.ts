import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ValidationPipe removed completely
  // This bypasses Vercel PackageLoader crash

  logger.log('⚠️ ValidationPipe disabled');

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 API running on port ${port}`);
}

bootstrap();