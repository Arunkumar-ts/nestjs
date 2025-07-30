import { Injectable } from "@nestjs/common";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { EditBookmarkDto } from "./dto/edit-bookmark.dto";
import { PrismaService } from "src/prisma/prisma.service";
import ReturnResponse from "src/common/commonResponse/return-response";

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookmarks(userId: number): Promise<ReturnResponse> {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: {
          userId,
        },
      });
      return ReturnResponse.createSuccess(
        "Bookmarks fetched successfully!",
        bookmarks,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async getBookmarkById(
    userId: number,
    bookmarkId: number,
  ): Promise<ReturnResponse> {
    try {
      const bookmark = await this.prisma.bookmark.findFirst({
        where: {
          id: bookmarkId,
          userId,
        },
      });
      if (!bookmark) {
        return ReturnResponse.createFailure("Bookmark not found!");
      }
      return ReturnResponse.createSuccess(
        "Bookmark fetched successfully!",
        bookmark,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ): Promise<ReturnResponse> {
    try {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });
      return ReturnResponse.createSuccess(
        "Bookmarks created successfully!",
        bookmark,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async editBookmarkById(
    userId: number,
    dto: EditBookmarkDto,
    bookmarkId: number,
  ): Promise<ReturnResponse> {
    try {
      const bookmarkMatch = await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

      if (!bookmarkMatch || bookmarkMatch.userId !== userId) {
        return ReturnResponse.createFailure("Access to resorces denied!");
      }

      const bookmark = await this.prisma.bookmark.update({
        where: {
          id: bookmarkId,
          userId,
        },
        data: {
          ...dto,
        },
      });
      return ReturnResponse.createSuccess(
        "Bookmarks updated successfully!",
        bookmark,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ): Promise<ReturnResponse> {
    try {
      const bookmarkMatch = await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

      if (!bookmarkMatch || bookmarkMatch.userId !== userId) {
        return ReturnResponse.createFailure("Access to resorces denied!");
      }

      const bookmark = await this.prisma.bookmark.delete({
        where: {
          id: bookmarkId,
          userId,
        },
      });
      return ReturnResponse.createSuccess(
        "Bookmarks deleted successfully!",
        bookmark,
      );
    } catch (error) {
      return ReturnResponse.createFailure("Internal server error", error);
    }
  }
}
