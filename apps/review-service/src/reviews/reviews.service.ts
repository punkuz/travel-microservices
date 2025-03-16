/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "./schema/review.schema";
import { Model } from "mongoose";
import { MessagePattern } from "@nestjs/microservices";
import { error } from "console";

export interface AuthRequest extends Request {
  user?: any;
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      return await this.reviewModel.create(createReviewDto);
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

  findAll(tourId: string) {
    try {
      return this.reviewModel.find({ tourId });
    } catch (error) {
      throw new BadRequestException(error, "Unknown error");
    }
  }

  findOne(id: string) {
    try {
      return this.reviewModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error, "Unknown error");
    }
  }

  update(id: string | undefined, updateReviewDto: UpdateReviewDto) {
    try {
      return this.reviewModel.findByIdAndUpdate(id, updateReviewDto, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new BadRequestException(error, "Unknown error");
    }
  }

  delete(id: string) {
    try {
      return this.reviewModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error, "Unknown error");
    }
  }
}
