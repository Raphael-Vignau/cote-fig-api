import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeleteResult, Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../enums/user.role';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }

    async findOneUserById(id: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ id });
    }

    async findOneUserByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ email });
    }

    async findUsers(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<UserEntity[]> {
        return await this.userRepository.find({
            skip, take, order,
            where: {
                username: Like(`%${contains}%`)
            }
        });
    }

    async findAllForExport(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { role: UserRole.USER }
        });
    }

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        return this.userRepository.save(user)
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<UserEntity> {
        // On récupére le user et on remplace les anciennes valeurs
        const targetUser = await this.userRepository.preload({
            id,
            ...user
        });
        // tester si le user avec cet id n'existe pas
        if (!targetUser) {
            throw new NotFoundException();
        }
        if (user.password) {
            targetUser.password = await AuthService.hashPassword(user.password);
        }
        return await this.userRepository.save(targetUser);
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async countUsers(): Promise<number> {
        return await this.userRepository.count();
    }
}
