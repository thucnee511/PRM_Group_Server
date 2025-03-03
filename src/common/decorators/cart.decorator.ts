import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestCartId = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const cartId = request.cartId;
    if(!cartId) throw new BadRequestException('Cart not found');
    return cartId;
  },
);