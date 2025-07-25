import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/commonResponse/http-exception";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors();

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Bookmarks")
    .setDescription("API for managing bookmarks and user data.")
    .setVersion("1.0")
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      "jwt-auth"
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, documentFactory);

  app.useStaticAssets(join(__dirname, "..", "uploads"));

  await app.listen(process.env.PORT ?? 3000);

  Logger.log(
    `🚀 Server at http://localhost:${process.env.PORT}/api ...`,
    "Server"
  );
  Logger.log(
    `🚀 Swagger at http://localhost:${process.env.PORT}/api-docs ...`,
    "Swagger"
  );
}
bootstrap();
