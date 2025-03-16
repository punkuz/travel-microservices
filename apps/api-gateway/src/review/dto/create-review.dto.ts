import { IsNotEmpty, IsOptional, Max, Min } from "class-validator";
import mongoose from "mongoose";

export class CreateReviewDto {
  id: string;

  @Max(200)
  @Min(20)
  @IsNotEmpty()
  review: string;

  @IsOptional()
  image: string;

  @Max(5)
  @Min(1)
  rating: number;

  tourId: mongoose.Schema.Types.ObjectId;

  authorId: mongoose.Schema.Types.ObjectId;
}
