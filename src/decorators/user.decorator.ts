import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'node:http';

const jwtService = new JwtService();
const configService = new ConfigService();

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const res: IncomingMessage = ctx.switchToHttp().getRequest();
    const access = res.headers.access as string;

    const secret = configService.get('JWT_SECRET')!;
    const verify = jwtService.verify(access, { secret });
    return { email: verify.email, access };
  },
);
