/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { promisify } from "util";
import * as jwt from "jsonwebtoken";

import { BadRequestException, Controller, NotFoundException, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./schema/user.schema";
import { UpdatePasswordPayload } from "./dto/update-password";
import { AuthGuard } from "src/guards/auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/types/role.enum";
import { RolesGuard } from "src/guards/role.guard";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern("user_signup")
  signup(user: User) {
    return this.userService.signup(user);
  }

  @MessagePattern("update_password")
  @UseGuards(AuthGuard)
  updatedPassword(@Payload() data: UpdatePasswordPayload) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const updatePasswordDto = data["updatePasswordDto"];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.userService.updatePassword(updatePasswordDto, data.user);
  }

  @MessagePattern("user_login")
  login(loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @MessagePattern("listusers")
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @MessagePattern("verify_token")
  async verifyToken(token: string): Promise<User> {
    try {
      const decoded: jwt.JwtPayload = await promisify(jwt.verify)(
        token["token"],
        process.env.JWT_SECRET,
      );

      const user = await this.userService.findOne(decoded.id);

      if (!user) {
        throw new NotFoundException("User not found.");
      }

      return user;
    } catch (error) {
      console.log("err from verify token", error);
      throw new BadRequestException("Invalid or expired token.");
    }
  }
}
