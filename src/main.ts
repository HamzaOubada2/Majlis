import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // ProtecT http Headers
  app.use(helmet());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,// Remove any undefined fields in the DTO
      forbidNonWhitelisted: true,// Throw an error if the user submits unexpected fields
      transform: true,// Automatically convert data to the specified types
    })
  )


  const config = new DocumentBuilder()
    .setTitle('Majlis API - Seminar Reservation System')
    .setDescription('Documentation for Majlis platform REST API endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header'
      },
      'JWT-auth'
    )
    .build();

  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger Docs available at: http://localhost:${port}/api/docs`)
}
bootstrap();
