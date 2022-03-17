import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupUserDto {

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
}
