import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppDataSource } from "./database/datasource";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 3004,
      },
    },
  );
  //initialize datasource
  AppDataSource.initialize()
    .then(async () => {
      console.log("Data Source has been initialized!");
      await app.listen();
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
}
bootstrap();
