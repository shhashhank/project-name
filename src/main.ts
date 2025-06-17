import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BoomExceptionFilter } from './common/filters/boom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter for Boom errors
  app.useGlobalFilters(new BoomExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('A scalable NestJS-based e-commerce backend API')
    .setVersion('1.0')
    .addTag('Products')
    .addTag('App')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
// test comment
