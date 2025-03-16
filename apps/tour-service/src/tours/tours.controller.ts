import { Body, Controller, Post, Query } from "@nestjs/common";
import { ToursService } from "./tours.service";
import { Tour } from "./schema/tour.schema";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UpdateTourDto } from "./dto/update-tour.dto";

@Controller("tours")
export class ToursController {
  constructor(private readonly tourService: ToursService) {}

  @MessagePattern("create_tour")
  createTour(tour: Tour) {
    console.log("tour", tour);
    return this.tourService.createTour(tour);
  }

  @MessagePattern("find_all_tours")
  getAllTours(query: Record<string, any>) {
    return this.tourService.getAllTours(query);
  }

  @MessagePattern("find_one_tour")
  getTour(id: string) {
    return this.tourService.getTour(id);
  }

  @MessagePattern("update_tour")
  updateTour(@Payload() data: UpdateTourDto) {
    const { id, ...rest } = data;
    return this.tourService.updateTour(id, rest["updateTourDto"]);
  }

  @MessagePattern("delete_tour")
  deleteTour(id: string) {
    return this.tourService.deleteTour(id);
  }
}
