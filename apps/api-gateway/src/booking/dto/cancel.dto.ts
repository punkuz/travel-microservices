import { PartialType } from "@nestjs/mapped-types";
import { CreateBookingDto } from "./booking.dto";

export class CancelBookingDto extends PartialType(CreateBookingDto) {}
