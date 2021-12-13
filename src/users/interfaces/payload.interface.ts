import { UserStatus } from "src/enums/user.status";
import { UserRole } from "src/enums/user.role";

export interface PayloadInterface {
    username: string,
    email: string,
    role: UserRole,
    sub: string,
    status: UserStatus

}
