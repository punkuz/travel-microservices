import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UserController } from "./user/user.controller";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TourController } from "./tour/tour.controller";
import { AuthMiddleware } from "./middleware/protect.middleware";
import { ReviewController } from "./review/review.controller";
import { BookingController } from "./booking/booking.controller";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: "USER_CLIENT",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3001,
        },
      },
      {
        name: "TOUR_CLIENT",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3002,
        },
      },
      {
        name: "REVIEW_CLIENT",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3003,
        },
      },
      {
        name: "BOOKING_CLIENT",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3004,
        },
      },
    ]),
  ],
  controllers: [
    UserController,
    TourController,
    ReviewController,
    BookingController,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "tours/:id", method: RequestMethod.GET },
        { path: "tours/:id", method: RequestMethod.DELETE },
        { path: "tours/:id", method: RequestMethod.PATCH },
      );
  }
}
