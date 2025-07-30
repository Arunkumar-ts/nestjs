import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signin.dto";
import { LogInDto } from "./dto/login.dto";
import CommonResponse from "src/common/commonResponse/commonResponse";
import ReturnResponse from "src/common/commonResponse/return-response";
import { Request, Response } from "express";
import { GoogleGuard } from "./guard/google.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleGuard)
  @Get("google/login")
  async googleLogin() {
    // Google redirect handled automatically
  }

  @UseGuards(GoogleGuard)
  @Get("google/callback")
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { email, firstName, lastName } = req.user as any;
    const result: ReturnResponse = await this.authService.emailExist(email);
    if (result.success) {
      const { id, email } = result.data;
      const token: ReturnResponse = await this.authService.signToken(id, email);
      if (token.success) {
        return res.redirect(
          `http://localhost:3000?token=${token.data.accessToken}}`
        );
      }
    } else {
      const user: ReturnResponse = await this.authService.createUser({
        email,
        firstName,
        lastName,
      });
      if (user.success) {
        const { id, email } = user.data;
        const token: ReturnResponse = await this.authService.signToken(
          id,
          email
        );
        if (token.success) {
          return res.redirect(
            `http://localhost:3000?token=${token.data.accessToken}}`
          );
        }
      }
    }
    return res.redirect(`http://localhost:3000`);
  }

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