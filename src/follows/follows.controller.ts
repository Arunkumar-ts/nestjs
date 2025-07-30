import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FollowsService } from "./follows.service";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import CommonResponse from "src/common/commonResponse/commonResponse";
import ReturnResponse from "src/common/commonResponse/return-response";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth("jwt-auth")
@UseGuards(JwtGuard)
@Controller("follows")
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get("followers")
  async getFollowers(@GetUser("id") userId: number): Promise<CommonResponse> {
    const result: ReturnResponse =
      await this.followsService.getFollowers(userId);
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Get("following")
  async getFollowing(@GetUser("id") userId: number): Promise<CommonResponse> {
    const result: ReturnResponse =
      await this.followsService.getFollowing(userId);
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Post(":userId")
  async createFollower(
    @GetUser("id") userId: number,
    @Param("followingId") followingId: number,
  ): Promise<CommonResponse> {
    const result: ReturnResponse = await this.followsService.createFollower(
      userId,
      followingId,
    );
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }
}
