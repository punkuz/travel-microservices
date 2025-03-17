import {
  IsDateString,
  IsNumber,
  Min,
  IsString,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  REFUNDED = "refunded",
}

enum BookingStatus {
  CONFIRMED = "confirmed",
  PENDING = "pending",
  CANCELED = "canceled",
}

class PaymentDetailsDto {
  @IsString()
  transactionId: string;

  @IsString()
  paymentMethod: string;
  // add other fields as needed
}

export class CreateBookingDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  tourId: string;

  @IsDateString()
  bookingDate: Date;

  @IsNumber()
  @Min(1)
  numberOfParticipants: number;

  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(BookingStatus)
  bookingStatus?: BookingStatus;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails?: PaymentDetailsDto;
}
