import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { DeleteResult, Like, Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthService } from "../auth/auth.service";
import { UserRole } from "../enums/user.role";
import { FigurineEntity } from "src/figurines/entities/figurine.entity";
import { NotAcceptableException } from "@nestjs/common/exceptions/not-acceptable.exception";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(FigurineEntity)
        private figurineRepository: Repository<FigurineEntity>
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
            where: [
                { username: Like(`%${contains}%`) },
                { email: Like(`%${contains}%`) }
            ]
        });
    }

    async findAllForExport(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { role: UserRole.USER }
        });
    }

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        return this.userRepository.save(user);
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

    async addToCollection(userId: string, figurineId: string): Promise<UserEntity> {
        console.log("User : "+userId+" add to collection : " + figurineId);
        const targetUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["collection"]
        });
        if (!targetUser) {
            throw new NotFoundException();
        }
        const alreadyIn = await targetUser.collection.find( figurine => figurine.id === figurineId );
        if (alreadyIn) {
            throw new NotAcceptableException({code: 406, message: 'Déjà dans la collection !' } );
        }
        const targetFigurine = await this.figurineRepository.findOne({ id: figurineId });
        if (!targetFigurine) {
            throw new NotFoundException();
        }
        targetUser.collection.push(targetFigurine);
        return await this.userRepository.save(targetUser);
    }

    async removeToCollection(userId: string, figurineId: string): Promise<UserEntity> {
        console.log("User : "+userId+" remove to collection : " + figurineId);
        const targetUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["collection"]
        });
        if (!targetUser) {
            throw new NotFoundException();
        }
        targetUser.collection = targetUser.collection.filter( figurine => figurine.id !== figurineId)
        return await this.userRepository.save(targetUser);
    }

    async addToWishlist(userId: string, figurineId: string): Promise<UserEntity> {
        console.log("User : "+userId+" add to wishlist : " + figurineId);
        const targetUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["wishlist"]
        });
        if (!targetUser) {
            throw new NotFoundException();
        }
        const alreadyIn = await targetUser.wishlist.find( figurine => figurine.id === figurineId );
        if (alreadyIn) {
            throw new NotAcceptableException({code: 406, message: 'Déjà dans la wishlist !' } );
        }
        const targetFigurine = await this.figurineRepository.findOne({ id: figurineId });
        if (!targetFigurine) {
            throw new NotFoundException();
        }
        targetUser.wishlist.push(targetFigurine);
        return await this.userRepository.save(targetUser);
    }

    async removeToWishlist(userId: string, figurineId: string): Promise<UserEntity> {
        console.log("User : "+userId+" remove to wishlist : " + figurineId);
        const targetUser = await this.userRepository.findOne({
            where: { id: userId },
            relations: ["wishlist"]
        });
        if (!targetUser) {
            throw new NotFoundException();
        }
        targetUser.wishlist = targetUser.wishlist.filter( figurine => figurine.id !== figurineId)
        return await this.userRepository.save(targetUser);
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async countUsers(contains = ""): Promise<number> {
        return await this.userRepository.count({
            where: [
                { username: Like(`%${contains}%`) },
                { email: Like(`%${contains}%`) }
            ]
        });
    }
}
