import { Module } from "@nestjs/common";
import { ReviewsModule } from "./reviews/reviews.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://shahpunkuz95:${process.env.DB_PASSWORD}@cluster0.655qv.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0`,
    ),
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
