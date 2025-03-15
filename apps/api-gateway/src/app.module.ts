import { Module } from "@nestjs/common";
import { UserController } from "./user/user.controller";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
    ]),
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
