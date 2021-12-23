import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNumber()
    rating: number;
}
