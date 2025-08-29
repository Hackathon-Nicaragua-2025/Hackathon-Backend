// main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import {
  ValidationPipe,
  VersioningType,
  Logger,
  BadRequestException,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';
import compression from 'compression';
import * as YAML from 'yamljs';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule, {
    // Integrate Winston logger
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, context }) => {
              return `${timestamp} [${level}]${context ? ' [' + context + ']' : ''}: ${message}`;
            }),
          ),
        }),
        // Add file transport if needed
        new winston.transports.File({
          filename: 'logs/app.log',
          level: 'warn', // Log warnings and errors
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),
  });

  // Get configuration service
  const configService = app.get(ConfigService);

  // Integrate Helmet for security
  app.use(helmet());

  // Integrate rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  );

  // Enable compression
  app.use(compression());

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  // Use global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to DTO instances
      // Customize error messages
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Use global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Use global serialization interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger Settings
  const config = new DocumentBuilder()
    .setTitle('Perf Vision')
    .setDescription('Perf Vision API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      // Delete the "Controller" suffix from the controller name
      return `${controllerKey.replace('Controller', '')}_${methodKey}`;
    },
  });
  SwaggerModule.setup('docs', app, document);

  app.getHttpAdapter().get('/swagger.yaml', (req, res) => {
    const swaggerYaml = YAML.stringify(document);
    res.setHeader('Content-Type', 'application/x-yaml');
    res.send(swaggerYaml);
  });

  // Set up port from environment variables or default to 3000
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  // Use Logger instead of console.log
  Logger.log(`Swagger is running on: http://localhost:${port}/docs`, 'Bootstrap');
  Logger.log(`Swagger YAML available at: http://localhost:${port}/swagger.yaml`);
}

bootstrap().catch((error) => {
  console.log(error);
  Logger.error('Error starting the application', error, 'Bootstrap');
});
