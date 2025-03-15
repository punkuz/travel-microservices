import { Body, Controller, Inject, Patch, Post, Request } from "@nestjs/common";
import { CreateUserDto, LoginUserDto, UpdatePasswordDto } from "./dto/user.dto";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { AuthRequest } from "./types/request.type";
import { catchError, throwError } from "rxjs";

@Controller("users")
export class UserController {
  constructor(
    @Inject("USER_CLIENT") private readonly userClient: ClientProxy,
  ) {}
  @Post("signup")
  signup(@Body() user: CreateUserDto) {
    console.log("from api gateway", user);
    return this.userClient.send("user_signup", user);
  }
  //add a comment
  @Patch("updatePassword")
  updatedPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req: AuthRequest,
  ) {
    return this.userClient.send("update_password", {
      updatePasswordDto,
      token: req.headers.authorization,
    });
  }

  @Post("login")
  login(@Body() loginDto: LoginUserDto) {
    return this.userClient.send("user_login", loginDto).pipe(
      catchError((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return throwError(() => {
          throw new RpcException(err);
        });
      }),
    );
  }
}
