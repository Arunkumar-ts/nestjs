import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { LogInDto } from "./dto/login.dto";
import CommonResponse from "src/common/commonResponse/commonResponse";
import ReturnResponse from "src/common/commonResponse/return-response";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  async signin(@Body() dto: SignInDto): Promise<CommonResponse> {
    const result: ReturnResponse = await this.authService.signin(dto);
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Post("login")
  async login(@Body() dto: LogInDto): Promise<CommonResponse> {
    const result: ReturnResponse = await this.authService.login(dto);
    if (result.success) {
      return CommonResponse.success(200, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }
}
