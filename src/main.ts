import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Middleware pour gérer les CORS
    // const corsOptions = {
    //     origin: [configService.get('APP_CORS_ORIGIN')]
    // };
    // app.enableCors(corsOptions);
    app.enableCors();

    // Middleware pour afficher les logs
    // app.use(morgan('dev'));

    // Les Validateurs modifis le type et filtre les champs non attendus
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));
    await app.listen(configService.get('APP_PORT'));
}

bootstrap();
