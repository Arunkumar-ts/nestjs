import { Injectable } from "@nestjs/common";
import ReturnResponse from "src/common/commonResponse/return-response";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFollowers(userId: number): Promise<ReturnResponse> {
    try {
      const user = await this.prisma.follows.findMany({
        where: {
          followedId: userId,
        },
        select: {
          follower: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return ReturnResponse.createSuccess(
        "Followers fetched successfully!",
        user,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async getFollowing(userId: number): Promise<ReturnResponse> {
    try {
      const user = await this.prisma.follows.findMany({
        where: {
          followerId: userId,
        },
        select: {
          followed: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return ReturnResponse.createSuccess(
        "Followings fetched successfully!",
        user,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async createFollower(
    userId: number,
    followingId: number,
  ): Promise<ReturnResponse> {
    try {
      if (userId === followingId) {
        return ReturnResponse.createFailure("Failed to follow User!");
      }
      const isUser = await this.prisma.user.findUnique({
        where: {
          id: followingId,
        },
      });
      if (!isUser) {
        return ReturnResponse.createFailure("Failed to follow User not found!");
      }
      const user = await this.prisma.follows.create({
        data: {
          followerId: userId,
          followedId: followingId,
        },
        select: {
          followed: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return ReturnResponse.createSuccess("Followed successfully!", user);
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }
}
