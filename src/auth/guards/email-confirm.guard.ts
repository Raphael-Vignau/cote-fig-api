import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class EmailConfirmGuard implements CanActivate {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) {
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        if (!request.body || !request.body.token) {
            throw new BadRequestException("Invalid 1");
        }
        const payload = this.jwtService.verify(request.body.token, { secret: process.env.TOKEN_SECRET });

        const userExist = await this.userService.findOneUserByEmail(payload["email"]);
        if (!userExist) {
            throw new BadRequestException("Invalid 2");
        }
        request.user = userExist;
        return true;
    }
}
