import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  const server = app.getHttpServer();
  const io = new socketio.Server(server);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3002);
}
bootstrap();
