import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { PrismaService } from "src/prisma/prisma.service";
import { SignInDto } from "./dto/signin.dto";
import { LogInDto } from "./dto/login.dto";
import ReturnResponse from "src/common/commonResponse/return-response";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async signin(dto: SignInDto): Promise<ReturnResponse> {
    try {
      const hash = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return ReturnResponse.createFailure("Credentials incorrect!");
      }
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async login(dto: LogInDto): Promise<ReturnResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        return ReturnResponse.createFailure("Credentials incorrect!");
        // throw new ForbiddenException("Credentials incorrect!");
      }
      const pwMatch = await bcrypt.compare(dto.password, user.hash);
      if (!pwMatch) {
        return ReturnResponse.createFailure("Credentials incorrect!");
      }
      return this.signToken(user.id, user.email);
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async signToken(userId: number, email: string): Promise<ReturnResponse> {
    try {
      const payload = {
        sub: userId,
        email,
      };
      const secretKey = this.config.get("SECRETKEY");
      const token = await this.jwt.signAsync(payload, {
        expiresIn: "1h",
        secret: secretKey,
      });
      return ReturnResponse.createSuccess("User authorized!", {
        accessToken: token,
      });
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }
}
