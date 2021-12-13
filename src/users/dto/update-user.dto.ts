import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/enums/user.role";
import { UserStatus } from "src/enums/user.status";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    readonly username: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly password!: string;

    @IsOptional()
    @IsString()
    readonly tel!: string;

    @IsOptional()
    @IsEnum(UserRole)
    readonly role: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status!: UserStatus;
}
