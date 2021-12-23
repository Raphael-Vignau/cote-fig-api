import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FigurineEntity } from "./entities/figurine.entity";
import { Like, Repository, UpdateResult } from "typeorm";
import { CreateFigurineDto } from "./dto/create-figurine.dto";
import { UpdateFigurineDto } from "./dto/update-figurine.dto";
import { existsSync, unlink } from "fs";
import { TagEntity } from "src/tags/entities/tag.entity";

@Injectable()
export class FigurinesService {

    constructor(
        @InjectRepository(FigurineEntity)
        private figurineRepository: Repository<FigurineEntity>,
        @InjectRepository(TagEntity)
        private tagRepository: Repository<TagEntity>
    ) {
    }

    async findOneFigurineById(id: string): Promise<FigurineEntity> {
        return await this.figurineRepository.findOne({ id }, { relations: ["tags"] });
    }

    async findFigurines(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<FigurineEntity[]> {
        return await this.figurineRepository.find({
            skip, take, order,
            where: [
                { name: Like(`%${contains}%`) },
                { publisher: Like(`%${contains}%`) },
                { artist: Like(`%${contains}%`) },
                { game: Like(`%${contains}%`) }
            ]
        });
    }

    async findAll(): Promise<FigurineEntity[]> {
        return await this.figurineRepository.find();
    }

    async createFigurine(figurine: CreateFigurineDto, filesFigurine?: { img_figurine?: Express.Multer.File[], pdf_figurine?: Express.Multer.File[] }): Promise<FigurineEntity> {
        if (filesFigurine && filesFigurine.img_figurine && filesFigurine.img_figurine.length) {
            figurine.img_original_name = filesFigurine.img_figurine[0].originalname;
            figurine.img_name = filesFigurine.img_figurine[0].filename;
        }
        const newFigurine = {
            ...figurine
        };
        return await this.figurineRepository.save(newFigurine);
    }

    async updateFigurine(
        id: string,
        figurine: UpdateFigurineDto,
        filesFigurine?: { img_figurine?: Express.Multer.File[], pdf_figurine?: Express.Multer.File[] }
    ): Promise<FigurineEntity> {
        if (filesFigurine && filesFigurine.img_figurine && filesFigurine.img_figurine.length) {
            // Delete old img
            if (figurine.img_name) {
                this.deleteFileFigurine(figurine.img_name);
            }
            figurine.img_original_name = filesFigurine.img_figurine[0].originalname;
            figurine.img_name = filesFigurine.img_figurine[0].filename;
        }
        if (figurine.tags && figurine.tags.length) {
            figurine.tags.map(async (tag) => {
                await this.tagRepository.save(tag)
            })
        }
        // On récupére le figurine et on remplace les anciennes valeurs
        const targetFigurine = await this.figurineRepository.preload({
            id,
            ...figurine
        });
        // tester si la figurine avec cet id n'existe pas
        if (!targetFigurine) {
            throw new NotFoundException();
        }
        return await this.figurineRepository.save(targetFigurine);
    }

    async deleteFigurine(id: string): Promise<UpdateResult> {
        const figurine = await this.figurineRepository.findOne({ id });
        if (figurine.img_name) {
            this.deleteFileFigurine(figurine.img_name);
        }
        return await this.figurineRepository.softDelete(id);
    }

    deleteFileFigurine(fileName: string): void {
        const filePath = process.env.PATH_FILES_FIGURINE + fileName;
        if (existsSync(filePath)) {
            unlink(filePath, (err) => {
                if (err) throw err;
                console.log(filePath + " was deleted");
            });
        }
    }

    async countFigurines(contains = ""): Promise<number> {
        return await this.figurineRepository.count({
            where: [
                { name: Like(`%${contains}%`) },
                { publisher: Like(`%${contains}%`) },
                { artist: Like(`%${contains}%`) },
                { game: Like(`%${contains}%`) }
            ]
        });
    }
}
