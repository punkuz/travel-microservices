import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Controller()
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    @Inject("TOUR_CLIENT") private readonly tourClient: ClientProxy,
    @Inject("USER_CLIENT") private readonly userClient: ClientProxy,
  ) {}

  @MessagePattern("create_booking")
  create(createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @MessagePattern("get_all_booking")
  findAll() {
    return this.bookingsService.findAll();
  }

  @MessagePattern("get_single_booking")
  findOne(id: number) {
    return this.bookingsService.findOne(id);
  }

  //Cancel a booking
  @MessagePattern("cancel_booking")
  cancel(updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.cancel(updateBookingDto.id, updateBookingDto);
  }

  //Admin routes
  //Get a booking with user filed populated
  @MessagePattern("booking_full_details")
  async getAdminBooking(bookingId: number) {
    return this.bookingsService.fullBookingDetails(
      bookingId,
      this.tourClient,
      this.userClient,
    );
  }
}
