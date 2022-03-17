import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserEntity } from "src/users/entities/user.entity";
import { UserStatus } from "src/enums/user.status";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ usernameField: "email" });
    }

    async validate(email: string, password: string): Promise<Partial<UserEntity>> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("log invalid");
        }
        if (user.status === UserStatus.PENDING) {
            throw new UnauthorizedException("You need to validate your mail");
        }
        return user;
    }
}
