import { Body, Controller, Get, Post, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDto } from "src/dto";

@Controller(`/auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post(`/register`)
  async register(@Body() body: UserDto) {
    return await this.authService.register(body);
  }

  @Post(`/login`)
  async login(@Body() body: UserDto) {
    return await this.authService.login(body);
  }

  @Get(`/tokens`)
  async updateTokens(@Headers() headers) {
    return await this.authService.updateTokens(headers[`refresh`]);
  }
}
