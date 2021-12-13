import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorateur récupérable via @User
export const User = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    }
);
