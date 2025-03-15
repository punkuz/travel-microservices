import { Controller, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./schema/user.schema";
import {
  UpdatePasswordDto,
  UpdatePasswordPayload,
} from "./dto/update-password";
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
}
