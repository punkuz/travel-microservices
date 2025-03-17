import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { getBookingRepo } from "src/repositiories/repository";
import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";
import { CreateTourDto } from "./dto/create-tour.dto";

@Injectable()
export class BookingsService {
  create(createBookingDto: CreateBookingDto) {
    try {
      const newBooking = getBookingRepo().create(createBookingDto);
      return getBookingRepo().save(newBooking);
    } catch (error) {
      console.log("err from vontroller", error);
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return getBookingRepo().find();
  }

  async findOne(id: number) {
    const booking = await getBookingRepo().findOne({
      where: { id },
    });
    if (!booking) {
      throw new HttpException("Booking not found", HttpStatus.NOT_FOUND);
    }
    return {
      state: "successful",
      data: {
        booking,
      },
    };
  }

  async cancel(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await getBookingRepo().findOne({
      where: { id },
    });
    if (!booking) {
      throw new HttpException("Booking not found", HttpStatus.NOT_FOUND);
    }
    const canceledBooking = getBookingRepo().save({
      ...booking,
      ...updateBookingDto,
    });

    return {
      state: "successful",
      data: {
        canceledBooking,
      },
    };
  }

  async fullBookingDetails(
    bookingId: number,
    tourClient: ClientProxy,
    userClient: ClientProxy,
  ) {
    const booking = await getBookingRepo().findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new HttpException("Booking not found", HttpStatus.NOT_FOUND);
    }
    const tour = (await lastValueFrom(
      tourClient.send("find_one_tour", booking.tourId),
    )) as unknown as CreateTourDto;
    const user = (await lastValueFrom(
      userClient.send("get_user", booking.userId),
    )) as unknown;
    return {
      state: "successful",
      data: {
        ...booking,
        tour,
        user,
      },
    };
  }
}
