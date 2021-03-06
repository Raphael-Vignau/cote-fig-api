import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FigurineEntity } from "./entities/figurine.entity";
import { Like, Repository, UpdateResult } from "typeorm";
import { CreateFigurineDto } from "./dto/create-figurine.dto";
import { UpdateFigurineDto } from "./dto/update-figurine.dto";
import { existsSync, unlink } from "fs";
import { TagEntity } from "src/tags/entities/tag.entity";
import { UserEntity } from "src/users/entities/user.entity";

@Injectable()
export class FigurinesService {

    constructor(
        @InjectRepository(FigurineEntity)
        private figurineRepository: Repository<FigurineEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(TagEntity)
        private tagRepository: Repository<TagEntity>
    ) {
    }

    async findOneFigurineById(id: string): Promise<Partial<FigurineEntity>> {
        return await this.figurineRepository.createQueryBuilder("figurine")
            .leftJoin("figurine.holders", "holders")
            .leftJoin("figurine.researchers", "researchers")
            .leftJoin("figurine.tags", "tags")
            .addSelect(["holders.id", "holders.username", "researchers.id", "researchers.username", "tags.name"])
            .where({ id })
            .getOne();
    }

    async findFigurines(
        contains: string,
        skip: number,
        take: number,
        order: any,
        tagsNameList: string[] = []
    ): Promise<FigurineEntity[]> {
        return await this.figurineRepository.find({
            skip, take, order,
            relations: ["holders", "researchers"],
            join: { alias: "figurines", innerJoin: { tags: "figurines.tags" } },
            where: qb => {
                if (tagsNameList.length) {
                    qb.where("tags.name IN (:...tagsNameList)", { tagsNameList })
                        .groupBy("figurines.id")
                        .having("COUNT(distinct tags.name) >= " + tagsNameList.length);
                }
            }
        });
    }

    async findAll(): Promise<FigurineEntity[]> {
        return await this.figurineRepository.find();
    }

    async findMyCollection(
        idUser: string,
        skip: number,
        take: number,
        order: any,
        tagsNameList: string[] = []
        ): Promise<FigurineEntity[]> {
        console.log("Collection of user : " + idUser);
        return await this.figurineRepository.find({
            skip, take, order,
            join: { alias: "figurines", innerJoinAndSelect: { holders: "figurines.holders" }, innerJoin: { tags: "figurines.tags" } },
            where: qb => {
                qb.where("holders.id = :id", { id: idUser });
                if (tagsNameList.length) {
                    qb.where("tags.name IN (:...tagsNameList)", { tagsNameList })
                        .groupBy("figurines.id")
                        .having("COUNT(distinct tags.name) >= " + tagsNameList.length);
                }
            }
        });
    }

    async findMyWishlist(
        idUser: string,
        skip: number,
        take: number,
        order: any): Promise<FigurineEntity[]> {
        console.log("Wishlist of user : " + idUser);
        return await this.figurineRepository.find({
            skip, take, order,
            join: { alias: "figurines", innerJoin: { researchers: "figurines.researchers" } },
            where: qb => {
                qb.where("researchers.id = :id", { id: idUser });
            }
        });
    }

    async createFigurine(figurine: CreateFigurineDto, filesFigurine?: { img_figurine?: Express.Multer.File[], pdf_figurine?: Express.Multer.File[] }): Promise<FigurineEntity> {
        if (filesFigurine && filesFigurine.img_figurine && filesFigurine.img_figurine.length) {
            figurine.img_original_name = filesFigurine.img_figurine[0].originalname;
            figurine.img_name = filesFigurine.img_figurine[0].filename;
        }
        if (figurine.tags && figurine.tags.length) {
            figurine.tags.map(async (tag) => {
                await this.tagRepository.save(tag);
            });
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
                await this.tagRepository.save(tag);
            });
        }
        // On r??cup??re le figurine et on remplace les anciennes valeurs
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
