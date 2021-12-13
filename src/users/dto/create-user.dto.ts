import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from "src/enums/user.role";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly tel!: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    readonly role: UserRole;
}
