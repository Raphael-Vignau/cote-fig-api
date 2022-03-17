import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateTagDto } from "src/tags/dto/create-tag.dto";

export class CreateFigurineDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly publisher: string;

    @IsOptional()
    @IsString()
    readonly artist: string;

    @IsOptional()
    @IsString()
    readonly game: string;

    @IsOptional()
    @IsString()
    readonly material: string;

    @IsOptional()
    @IsString()
    readonly scale: string;

    @IsOptional()
    @IsNumber()
    readonly year: number;

    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;

    @IsOptional()
    @IsArray()
    tags: CreateTagDto[];
}
