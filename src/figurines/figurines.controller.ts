import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Res, UploadedFiles,
    UseGuards, UseInterceptors
} from "@nestjs/common";
import { FigurinesService } from "./figurines.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../enums/user.role";
import { FigurineEntity } from "./entities/figurine.entity";
import { CreateFigurineDto } from "./dto/create-figurine.dto";
import { UpdateFigurineDto } from "./dto/update-figurine.dto";
import { UpdateResult } from "typeorm";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileFilter } from "../utils/file-upload.utils";
import { existsSync } from "fs";
import { User } from "src/decorators/user.decorator";
import { PayloadInterface } from "src/users/interfaces/payload.interface";

@Controller("figurines")
export class FigurinesController {

    constructor(
        private readonly figurinesService: FigurinesService
    ) {
    }

    @Get()
    async findFigurines(
        @Query("_contains", new DefaultValuePipe("")) contains,
        @Query("_sort", new DefaultValuePipe("name")) sortBy,
        @Query("_direction", new DefaultValuePipe("ASC")) sortDirection,
        @Query("_start", new DefaultValuePipe(0), ParseIntPipe) start,
        @Query("_limit", new DefaultValuePipe(3), ParseIntPipe) limit,
        @Query("_tags", new DefaultValuePipe("[]")) tags
    ): Promise<FigurineEntity[]> {
        const tagsNameList = [];
        const tagsList = JSON.parse(tags);
        if (tagsList.length) {
            await tagsList.map(tag => tagsNameList.push(tag.name));
        }

        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.figurinesService.findFigurines(contains, start, limit, order, tagsNameList);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get("all")
    async findAll(): Promise<FigurineEntity[]> {
        return await this.figurinesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get("collection/me")
    async findMyCollection(
        @User() payload: PayloadInterface,
        @Query("_sort", new DefaultValuePipe("name")) sortBy,
        @Query("_direction", new DefaultValuePipe("ASC")) sortDirection,
        @Query("_start", new DefaultValuePipe(0), ParseIntPipe) start,
        @Query("_limit", new DefaultValuePipe(3), ParseIntPipe) limit,
        @Query("_tags", new DefaultValuePipe("[]")) tags
    ): Promise<FigurineEntity[]> {
        const tagsNameList = [];
        const tagsList = JSON.parse(tags);
        if (tagsList.length) {
            await tagsList.map(tag => tagsNameList.push(tag.name));
        }

        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.figurinesService.findMyCollection(payload.sub, start, limit, order, tagsNameList);
    }

    @UseGuards(JwtAuthGuard)
    @Get("wishlist/me")
    async findMyWishlist(
        @User() payload: PayloadInterface,
        @Query("_sort", new DefaultValuePipe("name")) sortBy,
        @Query("_direction", new DefaultValuePipe("ASC")) sortDirection,
        @Query("_start", new DefaultValuePipe(0), ParseIntPipe) start,
        @Query("_limit", new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<FigurineEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.figurinesService.findMyWishlist(payload.sub, start, limit, order);
    }

    @Get("count")
    async countFigurines(
        @Query("_contains", new DefaultValuePipe("")) contains
    ): Promise<number> {
        return await this.figurinesService.countFigurines(contains);
    }

    @Get(":id")
    async findOneFigurine(@Param("id") id: string): Promise<Partial<FigurineEntity>> {
        return await this.figurinesService.findOneFigurineById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: "img_figurine", maxCount: 1 }
            ], {
                storage: diskStorage({ destination: process.env.PATH_FILES_FIGURINE }),
                fileFilter: fileFilter
            }
        ))
    async createFigurine(
        @Body() newFigurine: CreateFigurineDto,
        @UploadedFiles() filesFigurine: { img_figurine?: Express.Multer.File[] }
    ): Promise<FigurineEntity> {
        return await this.figurinesService.createFigurine(newFigurine, filesFigurine);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(":id")
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: "img_figurine", maxCount: 1 },
                { name: "pdf_figurine", maxCount: 1 }
            ], {
                storage: diskStorage({ destination: process.env.PATH_FILES_FIGURINE }),
                fileFilter: fileFilter
            }
        ))
    async updateFigurine(
        @Param("id") id: string,
        @Body() figurine: UpdateFigurineDto,
        @UploadedFiles() filesFigurine: { img_figurine?: Express.Multer.File[], pdf_figurine?: Express.Multer.File[] }
    ): Promise<FigurineEntity> {
        return await this.figurinesService.updateFigurine(id, figurine, filesFigurine);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(":id")
    async deleteFigurine(@Param("id") id: string): Promise<UpdateResult> {
        return await this.figurinesService.deleteFigurine(id);
    }

    @Get("file/:filePath")
    seeUploadedFile(@Param("filePath") fileName, @Res() res) {
        const filePath = process.env.PATH_FILES_FIGURINE + fileName;
        if (existsSync(filePath)) {
            return res.sendFile(fileName, {
                root: process.env.PATH_FILES_FIGURINE
            });
        }
        throw new NotFoundException();
    }
}
