import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'node:http';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const res: IncomingMessage = context.switchToHttp().getRequest();
    const access = res.headers.access as string;

    if (!access) throw new UnauthorizedException(`Not found JWT`);
    else {
      const decode = this.jwtService.decode(access);
      if (!decode) throw new UnauthorizedException(`Can't decode`);

      try {
        const secret = this.configService.get('JWT_SECRET')!;
        const verify = this.jwtService.verify(access, { secret });
        if (decode[`email`] === verify[`email`]) return true;
      } catch (e) {
        throw new UnauthorizedException(`Can't verify`);
      }
    }

    throw new UnauthorizedException(`JWT isn't valid`);
  }
}