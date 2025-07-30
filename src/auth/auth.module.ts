import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { EmailService } from "src/email/email.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { GoogleStrategy } from "./strategy/google.strategies";

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService, GoogleStrategy],
})
export class AuthModule {}
