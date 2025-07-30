import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { BookmarkModule } from "./bookmark/bookmark.module";
import { PrismaModule } from "./prisma/prisma.module";
import { FileuploadModule } from "./fileupload/fileupload.module";
import { EmailModule } from "./email/email.module";
import { FollowsModule } from "./follows/follows.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    FileuploadModule,
    EmailModule,
    FollowsModule,
  ],
})
export class AppModule {}
