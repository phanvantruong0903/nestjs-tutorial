import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GrpcExceptionFilter } from './common/filters/exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
async function bootstrap() {
  dotenvConfig();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ['user', 'grpc.health.v1'],
        protoPath: [
          join(__dirname, '../proto/user.proto'),
          join(__dirname, '../proto/health.proto'),
        ],
        url: '127.0.0.1:50051',
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
}
bootstrap();
