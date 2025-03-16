import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Post,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard, AuthRequest } from "src/guards/auth.guard";
import { Role } from "src/types/role.enum";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";

@Controller("reviews")
export class ReviewController {
  constructor(
    @Inject("REVIEW_CLIENT") private readonly reviewClient: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req: AuthRequest,
  ) {
    return this.reviewClient.send("create_review", {
      ...createReviewDto,
      authorId: req.user?.id,
    });
  }

  //Get all reviews for a specific tour
  @Get("/tour/:tourId")
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  findAll(@Param("tourId") tourId: string, @Request() req: AuthRequest) {
    return this.reviewClient.send("get_all_tour_reviews", tourId);
  }

  @Get(":id")
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  findOne(@Param("id") id: string) {
    return this.reviewClient.send("get_single_review", id);
  }

  @Patch(":id")
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  update(@Param("id") id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewClient.send("update_review", { ...updateReviewDto, id });
  }

  @Delete(":id")
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string) {
    return this.reviewClient.send("delete_review", id);
  }
}
