import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //setup swagger
  const config = new DocumentBuilder()
    .setTitle('MY API MOVIE')
    .setDescription('movie-swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swagger = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('movie/swagger', app, swagger);

  await app.listen(8080);
}
bootstrap();

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
