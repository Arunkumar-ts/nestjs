import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import CommonResponse from "./commonResponse";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Error";
    let errors: any = null;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === "object" && res !== null) {
        const resObj = res as any;

        // message = resObj.message || resObj.error || message;

        // Class-validator validation errors
        if (Array.isArray(resObj.message)) {
          errors = { details: resObj.message };
        } else {
          errors = { details: [resObj.message || resObj.error] };
        }
      } 
      // else {
      //   message = res as string;
      // }
    }
    // } else if (exception?.message) {
    //   message = exception.message;
    // }

    const responseBody = CommonResponse.error(status, message, errors);

    response.status(status).json(responseBody);
  }
}
