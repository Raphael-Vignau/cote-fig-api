import { IsOptional, IsString } from "class-validator";

export class UpdateFigurineDto {

    @IsOptional()
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
    @IsString()
    readonly year: number;

    @IsOptional()
    @IsString()
    price: string;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;
}
