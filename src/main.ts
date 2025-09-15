import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
  session({
    secret: 'supersecretkey', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour
  }),
);
app.enableCors({
    origin: 'http://localhost:8000', // frontend URL
    credentials: true,               // allow cookies
  });

  await app.listen(process.env.PORT ?? 7000);
}
bootstrap();
