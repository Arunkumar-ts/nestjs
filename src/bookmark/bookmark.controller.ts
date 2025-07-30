import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { BookmarkService } from "./bookmark.service";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { EditBookmarkDto } from "./dto/edit-bookmark.dto";
import CommonResponse from "src/common/commonResponse/commonResponse";
import ReturnResponse from "src/common/commonResponse/return-response";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth("jwt-auth")
@UseGuards(JwtGuard)
@Controller("bookmark")
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  async getBookmarks(@GetUser("id") userId: number): Promise<CommonResponse> {
    const result: ReturnResponse =
      await this.bookmarkService.getBookmarks(userId);
    if (result.success) {
      return CommonResponse.success(200, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Get(":id")
  async getBookmarkById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) bookmarkId: number,
  ): Promise<CommonResponse> {
    const result: ReturnResponse = await this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
    if (result.success) {
      return CommonResponse.success(200, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Post()
  async createBookmark(
    @GetUser("id") userId: number,
    @Body() dto: CreateBookmarkDto,
  ): Promise<CommonResponse> {
    const result: ReturnResponse = await this.bookmarkService.createBookmark(
      userId,
      dto,
    );
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Put(":id")
  async editBookmarkById(
    @GetUser("id") userId: number,
    @Body() dto: EditBookmarkDto,
    @Param("id", ParseIntPipe) bookmarkId: number,
  ): Promise<CommonResponse> {
    const result: ReturnResponse = await this.bookmarkService.editBookmarkById(
      userId,
      dto,
      bookmarkId,
    );
    if (result.success) {
      return CommonResponse.success(201, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }

  @Delete(":id")
  async deleteBookmarkById(
    @GetUser("id") userId: number,
    @Param("id", ParseIntPipe) bookmarkId: number,
  ): Promise<CommonResponse> {
    const result: ReturnResponse =
      await this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    if (result.success) {
      return CommonResponse.success(200, result.data, result.message);
    } else {
      return CommonResponse.error(400, result.message, result.data);
    }
  }
}
