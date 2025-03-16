import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsOptional } from "class-validator";
import mongoose, { Document } from "mongoose";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Review extends Document {
  @Prop({
    required: true,
    trim: true,
    maxlength: 200,
    minlength: 20,
  })
  review: string;

  @Prop()
  @IsOptional()
  image: string;

  @Prop({ required: true, min: 1, max: 5, default: 1 })
  rating: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  tourId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  authorId: mongoose.Schema.Types.ObjectId;
}

// Generate Schema
export const ReviewSchema = SchemaFactory.createForClass(Review);
