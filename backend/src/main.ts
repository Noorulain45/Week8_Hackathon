import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ Modified to allow all origins for deployment
  app.enableCors({
    origin: true, // Dynamically allow the requesting origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ Use the port provided by the environment or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on port: ${port}`);
}
bootstrap();