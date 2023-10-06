import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RpcException, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { status } from '@grpc/grpc-js';

interface CreateMicroserviceOptions {
  url: string;
  protoName: string;
  packageName: string;
}

export const createMicroservice = async ({
  url,
  protoName,
  packageName,
}: CreateMicroserviceOptions) => {
  return await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: url,
      package: packageName,
      protoPath: join(`node_modules/e-shop-nest-proto/proto/${protoName}`),
    },
  });
};

export const getValidationPipe = () => {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    disableErrorMessages: true,
    exceptionFactory: (errors) => {
      const errorsList = errors.map((x) => Object.values(x.constraints)).flat();
      return new RpcException({
        code: status.INVALID_ARGUMENT,
        message: errorsList,
      });
    },
  });
};
