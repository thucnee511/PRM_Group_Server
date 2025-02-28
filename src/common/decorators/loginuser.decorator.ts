import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoginUser = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);