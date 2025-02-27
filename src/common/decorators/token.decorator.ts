import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AccessToken = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    return token;
  },
);