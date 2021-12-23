import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TagEntity } from "src/tags/entities/tag.entity";
import { Like, Repository, UpdateResult } from "typeorm";
import { CreateTagDto } from "src/tags/dto/create-tag.dto";
import { UpdateTagDto } from "src/tags/dto/update-tag.dto";

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private tagRepository: Repository<TagEntity>
    ) {
    }

    async findOneTagById(name: string): Promise<TagEntity> {
        return await this.tagRepository.findOne({ name });
    }

    async findTagsByFigurineId(idFigurine: string): Promise<TagEntity> {
        return await this.tagRepository.findOne({ where: {figurines: {id: idFigurine}} });
    }

    async findTags(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<TagEntity[]> {
        return await this.tagRepository.find({
            skip, take, order,
            where: [
                { name: Like(`%${contains}%`) }
            ]
        });
    }

    async findAll(): Promise<TagEntity[]> {
        return await this.tagRepository.find();
    }

    async createTag(tag: CreateTagDto): Promise<TagEntity> {
        const newTag = {
            ...tag,
            rating: 0
        };
        return await this.tagRepository.save(newTag);
    }

    async updateTag(
        tag: UpdateTagDto,
    ): Promise<TagEntity> {
        // On récupére le tag et on remplace les anciennes valeurs
        const targetTag = await this.tagRepository.preload({
            ...tag
        });
        // tester si la tag avec cet id n'existe pas
        if (!targetTag) {
            throw new NotFoundException();
        }
        return await this.tagRepository.save(targetTag);
    }

    async deleteTag(name: string): Promise<UpdateResult> {
        return await this.tagRepository.softDelete(name);
    }

    async countTags(contains = ''): Promise<number> {
        return await this.tagRepository.count({
            where: [
                { name: Like(`%${contains}%`) }
            ]
        });
    }
}
