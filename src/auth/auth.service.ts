import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';
import { UserDto } from "src/dto";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) { }

  private async genToken(email: string) {
    const secret = this.configService.get('JWT_SECRET')!;
    const refresh = await this.jwtService.signAsync({ email }, { secret, expiresIn: '3d' });
    const access = await this.jwtService.signAsync({ email }, { secret, expiresIn: '3m' });
    return { refresh, access };
  }

  async register(newUser: UserDto) {
    const { email } = newUser;
    const createUser = await this.userService.create(newUser);
    if (!createUser) return { success: false, description: 'Bad create user' };

    const { refresh, access } = await this.genToken(email);

    const updateTokens = await this.userService.updateTokens({ email, refresh });

    if (updateTokens.success) return { success: true, refresh, access };
    else return { success: false, description: updateTokens.description }
  }

  async login(user: UserDto) {
    const loginUser = await this.userService.login(user);
    if (!loginUser.success) return { success: false, description: loginUser.description };

    const { refresh, access } = await this.genToken(user.email);

    const updateTokens = await this.userService.updateTokens({ email: loginUser.user!.email, refresh });

    if (updateTokens.success) return { success: true, refresh, access };
    else return { success: false, description: updateTokens.description };
  }

  async updateTokens(refresh: string) {
    try {
      const secret = this.configService.get('SECRET')!;
      const { email } = await this.jwtService.verifyAsync(refresh, { secret });
      const user = await this.userService.get(email);

      if (!user) return { success: false, description: 'Bad verify refresh token!' }

      if (!user.refreshTokens.includes(refresh)) {
        return { success: false, description: `Refresh token not valid!` };
      }

      const { refresh: newRefresh, access } = await this.genToken(user.email);

      const updateTokens = await this.userService.updateTokens({ email, refresh: newRefresh, oldRefresh: refresh });
      if (updateTokens.success) return { success: true, refresh, access };
      else return { success: false, description: updateTokens.description };

    } catch (err) {
      this.logger.error(err);
      return { success: false, description: `Error update Token!` };
    }
  }

}