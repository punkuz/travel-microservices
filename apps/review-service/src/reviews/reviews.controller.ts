import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @MessagePattern("create_review")
  create(@Payload() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @MessagePattern('get_all_tour_reviews')
  findAll(tourId: string) {
    return this.reviewsService.findAll(tourId);
  }

  @MessagePattern('get_single_review')
  findOne(id: string) {
    return this.reviewsService.findOne(id);
  }

  @MessagePattern('update_review')
  update(updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(updateReviewDto.id, updateReviewDto);
  }

  @MessagePattern('delete_review')
  remove(id: string) {
    return this.reviewsService.delete(id);
  }
}
