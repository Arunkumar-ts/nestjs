import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";

import CommonResponse from "src/common/commonResponse/commonResponse";

@Controller("upload")
export class FileuploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException("File not provided or invalid format");
      }
      return CommonResponse.success(
        200,
        { filename: file.filename },
        "File uploaded successfully!"
      );
    } catch (error) {
      return CommonResponse.error(
        404,
        "File upload failed",
        error?.message || error
      );
    }
  }
}
