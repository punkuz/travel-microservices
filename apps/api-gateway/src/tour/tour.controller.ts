import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { AuthRequest } from "src/user/types/request.type";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/types/role.enum";

@Controller("tours")
export class TourController {
  constructor(
    @Inject("TOUR_CLIENT") private readonly tourClient: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.Guide)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  create(@Body() createTourDto: CreateTourDto, @Request() req: AuthRequest) {
    const guides = [req.user?.id];
    return this.tourClient.send("create_tour", {
      ...createTourDto,
      guides,
    });
  }

  @Get()
  @Roles(Role.Admin, Role.User, Role.Guide)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  findAll(@Request() req: AuthRequest) {
    return this.tourClient.send("find_all_tours", req.query);
  }

  @Get(":id")
  @Roles(Role.Admin, Role.User, Role.Guide)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  findOne(
    @Headers("x-user-role") userRole: string,
    @Param("id") id: string,
    @Request() req: AuthRequest,
  ) {
    return this.tourClient.send("find_one_tour", id);
  }

  @Patch(":id")
  @Roles(Role.Admin, Role.Guide)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateTourDto: UpdateTourDto,
    @Request() req: AuthRequest,
  ) {
    return this.tourClient.send("update_tour", {
      updateTourDto,
      id,
    });
  }

  @Delete(":id")
  @Roles(Role.Admin, Role.Guide)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string, @Request() req: AuthRequest) {
    return this.tourClient.send("delete_tour", id);
  }
}
