import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  IsEnum,
  IsNotEmpty,
} from "class-validator";

export class CreateTourDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  rating: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  maxGroupSize?: number;

  @IsEnum(["easy", "medium", "difficult"], {
    message: "Difficulty must be easy, medium, or difficult",
  })
  @IsNotEmpty()
  difficulty: string;

  @IsOptional()
  @IsNumber()
  ratingsAverage?: number;

  @IsOptional()
  @IsNumber()
  ratingsQuantity?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  imageCover: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  startDates?: string[];

  @IsOptional()
  total?: number;
}
