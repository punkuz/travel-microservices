/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Repository } from "typeorm";
import { Booking } from "src/bookings/entities/booking.entity";
import { AppDataSource } from "src/database/datasource";
let bookingRepo: Repository<Booking> | null = null;
export const getBookingRepo = () => {
  if (!bookingRepo) {
    bookingRepo = AppDataSource.getRepository(Booking);
  }
  return bookingRepo;
};
