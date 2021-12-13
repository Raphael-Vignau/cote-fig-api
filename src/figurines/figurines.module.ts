import { Module } from '@nestjs/common';
import { FigurinesController } from './figurines.controller';
import { FigurinesService } from './figurines.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FigurineEntity } from './entities/figurine.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([FigurineEntity])
    ],
    controllers: [FigurinesController],
    providers: [FigurinesService]
})
export class FigurinesModule {
}
