import { Module } from "@nestjs/common";
import { BookingsModule } from "./bookings/bookings.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [BookingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
