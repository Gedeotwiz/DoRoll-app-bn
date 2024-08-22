import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('API/V1');
  app.useGlobalPipes(new ValidationPipe({transform: true,}));
  const config = new DocumentBuilder()
  .setTitle('DoRoll API')
  .setDescription('DoRoll application Api in nest js')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document,{customSiteTitle: 'DoRoll API Documentation'})
  

  await app.listen(3000);
}
bootstrap();
