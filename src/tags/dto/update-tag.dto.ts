import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTagDto {
    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsNumber()
    rating: number;
}