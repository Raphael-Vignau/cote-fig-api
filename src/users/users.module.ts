import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { FigurineEntity } from "src/figurines/entities/figurine.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([UserEntity, FigurineEntity])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})

export class UsersModule {
}
