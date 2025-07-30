import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto/edit-user.dto";
import * as bcrypt from "bcryptjs";
import ReturnResponse from "src/common/commonResponse/return-response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto): Promise<ReturnResponse> {
    try {
      const { password, ...userData } = dto;
      if (dto.password) {
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hash,
            ...userData,
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });
        return ReturnResponse.createSuccess("User updated successfully!", user);
      } else {
        const user = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            ...userData,
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        });
        return ReturnResponse.createSuccess("User updated successfully!", user);
      }
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return ReturnResponse.createFailure(
          "Credentials taken!",
          "Email already taken ",
        );
      }
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async deleteUser(userId: number): Promise<ReturnResponse> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id: userId,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      return ReturnResponse.createSuccess("User deleted successfully!", user);
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async getUsers(): Promise<ReturnResponse> {
    try {
      const user = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      return ReturnResponse.createSuccess("Users fetched successfully!", user);
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }
}
