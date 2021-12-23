import { Module } from "@nestjs/common";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "src/tags/entities/tag.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([TagEntity])
    ],
    controllers: [TagsController],
    providers: [TagsService]
})
export class TagsModule {
}
