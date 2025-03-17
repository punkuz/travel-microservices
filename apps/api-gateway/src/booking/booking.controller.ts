import {
  Controller,
  Body,
  Patch,
  Param,
  Inject,
  Post,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard, AuthRequest } from "src/guards/auth.guard";
import { Role } from "src/types/role.enum";
import { RolesGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { CreateBookingDto } from "./dto/booking.dto";
import { CancelBookingDto } from "./dto/cancel.dto";

@Controller("bookings")
export class BookingController {
  constructor(
    @Inject("BOOKING_CLIENT") private readonly bookingClient: ClientProxy,
  ) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: AuthRequest,
  ) {
    return this.bookingClient.send("create_booking", {
      ...createBookingDto,
      userId: req.user?.id,
    });
  }

  //Get all bookings
  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  findAll() {
    return this.bookingClient.send("get_all_booking", {});
  }

  @Get("/admin/:bookingId")
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  getFullBookingDetails(@Param("bookingId") bookingId: number) {
    return this.bookingClient.send("booking_full_details", bookingId);
  }

  @Get(":id")
  @Roles(Role.User, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  findOne(@Param("id") id: number) {
    return this.bookingClient.send("get_single_booking", id);
  }

  //cancel a booking
  @Patch(":id")
  @Roles(Role.User, Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  cancel(@Param("id") id: string, @Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingClient.send("cancel_booking", {
      ...cancelBookingDto,
      id,
    });
  }
}
