import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Tour } from "./schema/tour.schema";
import { Model } from "mongoose";
import SearchFilter from "src/extra/search.filter";

@Injectable()
export class ToursService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
  ) {}

  async getAllTours(query: Record<string, any>): Promise<Tour[]> {
    const searchQuery = new SearchFilter(this.tourModel.find(), query)
      .filter()
      .sort()
      .fields()
      .paginate();
    return searchQuery.mongooseQuery;
  }

  async createTour(@Body() tour: Tour): Promise<Tour> {
    try {
      return await this.tourModel.create(tour);
    } catch (error) {
      throw new HttpException(
        {
          // status: HttpStatus.INTERNAL_SERVER_ERROR,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTour(id: string) {
    const tour = await this.tourModel.findById(id);
    if (!tour) {
      throw new NotFoundException("Tour not found");
    }
    return tour;
  }

  async updateTour(id: string | undefined, data: any) {
    try {
      const updatedTour = await this.tourModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });
      if (!updatedTour) {
        throw new NotFoundException("Tour not found!");
      }
      return {
        message: "Tour successfully updated",
        updatedTour,
      };
    } catch (error) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        err: error,
        message: "something went wrong",
      };
    }
  }

  async deleteTour(id: string): Promise<string> {
    const tour = await this.tourModel.findByIdAndDelete(id);
    if (!tour) {
      throw new NotFoundException("Tour not found!");
    }
    return "Tour successfully deleted";
  }
}
