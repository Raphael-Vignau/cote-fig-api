import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PayloadInterface } from './interfaces/payload.interface';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findUsers(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('username')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        }
        return await this.usersService.findUsers(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<UserEntity[]>  {
        return await this.usersService.findAllForExport();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countUsers(
        @Query('_contains', new DefaultValuePipe('')) contains
    ): Promise<number> {
        return await this.usersService.countUsers(contains);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@User() payload: PayloadInterface): Promise<UserEntity> {
        return await this.usersService.findOneUserById(payload.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateMe(@User() payload: PayloadInterface, @Body() user: UpdateUserDto): Promise<UserEntity> {
        return await this.usersService.updateUser(payload.sub, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<UserEntity> {
        return await this.usersService.updateUser(id, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return await this.usersService.deleteUser(id);
    }

    //Ouvrir le droit au propiétaire en plus de l'admin
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.usersService.findOneUserById(id);
    }
}
