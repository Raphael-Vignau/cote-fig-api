import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, Param,
    ParseIntPipe,
    Post, Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { TagsService } from "src/tags/tags.service";
import { TagEntity } from "src/tags/entities/tag.entity";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/decorators/roles.decorator";
import { UserRole } from "src/enums/user.role";
import { CreateTagDto } from "src/tags/dto/create-tag.dto";
import { UpdateTagDto } from "src/tags/dto/update-tag.dto";
import { UpdateResult } from "typeorm";

@Controller('tags')
export class TagsController {


    constructor(
        private readonly tagsService: TagsService
    ) {
    }

    @Get()
    async findTags(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('rating')) sortBy,
        @Query('_direction', new DefaultValuePipe('DESC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(10), ParseIntPipe) limit
    ): Promise<TagEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.tagsService.findTags(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<TagEntity[]> {
        return await this.tagsService.findAll();
    }

    @Get('count')
    async countTags(
        @Query('_contains', new DefaultValuePipe('')) contains
    ): Promise<number> {
        return await this.tagsService.countTags(contains);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createTag(
        @Body() newTag: CreateTagDto,
    ): Promise<TagEntity> {
        return await this.tagsService.createTag(newTag);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put()
    async updateTag(
        @Body() tag: UpdateTagDto,
    ): Promise<TagEntity> {
        return await this.tagsService.updateTag(tag);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':name')
    async deleteTag(@Param('name') name: string): Promise<UpdateResult> {
        return await this.tagsService.deleteTag(name);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':name')
    async findOneTag(@Param('name') name: string): Promise<TagEntity> {
        return await this.tagsService.findOneTagById(name);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('figurine/:idFigurine')
    async findTagsByFigurineId(@Param('idFigurine') idFigurine: string): Promise<TagEntity> {
        return await this.tagsService.findTagsByFigurineId(idFigurine);
    }
}
