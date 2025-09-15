import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GrpcExceptionFilter } from './common/filters/exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';

async function bootstrap() {
  dotenvConfig();

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../proto/user.proto'),
      url: '0.0.0.0:50051',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.startAllMicroservices();
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
