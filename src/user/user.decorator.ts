import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// export const User = (...args: string[]) => SetMetadata('user', args);
export const GqlUser = createParamDecorator((data: unknown, context) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
})