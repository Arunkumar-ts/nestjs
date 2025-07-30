import { Body, Controller, Delete, Get, Put, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { ApiBearerAuth } from "@nestjs/swagger";

import { JwtGuard } from "src/auth/guard/jwt.guard";
import { EditUserDto } from "./dto/edit-user.dto";
import { UserService } from "./user.service";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import CommonResponse from "src/common/commonResponse/commonResponse";
import ReturnResponse from "src/common/commonResponse/return-response";

@ApiBearerAuth("jwt-auth")
@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  getMe(@GetUser() user: User): CommonResponse {
    if (user) {
      return CommonResponse.success(200, user, "User fetched successfully!");
    } else {
      return CommonResponse.error(404, "User not find");
    }
  }

  @Get()
  async getUsers(): Promise<CommonResponse> {
    const result: ReturnResponse = await this.userService.getUsers();
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Put()
  async editUser(
    @GetUser("id") userId: number,
    @Body() dto: EditUserDto,
  ): Promise<CommonResponse> {
    const result: ReturnResponse = await this.userService.editUser(userId, dto);
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Delete()
  async deleteUser(@GetUser("id") userId: number): Promise<CommonResponse> {
    const result: ReturnResponse = await this.userService.deleteUser(userId);
    if (result.success) {
      return CommonResponse.success(200, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }
}
