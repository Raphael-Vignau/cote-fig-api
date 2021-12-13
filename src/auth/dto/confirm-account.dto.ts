import { IsJWT, IsNotEmpty } from 'class-validator';

export class ConfirmAccountDto {
    @IsNotEmpty()
    @IsJWT()
    token: string;
}
