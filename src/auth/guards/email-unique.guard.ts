import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";

@Injectable()
export class EmailUniqueGuard implements CanActivate {
    constructor(private readonly userService: UsersService) {
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userService.findOneUserByEmail(request.body.email);
        if (userExist) {
            throw new ForbiddenException("This email already exist");
        }
        return true;
    }
}
