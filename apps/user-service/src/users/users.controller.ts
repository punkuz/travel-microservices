import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./schema/user.schema";
import { UpdatePasswordDto } from "./dto/update-password";
import { AuthGuard, AuthRequest } from "src/guards/auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/types/role.enum";
import { RolesGuard } from "src/guards/role.guard";
import { MessagePattern } from "@nestjs/microservices";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @MessagePattern("signup")
  signup(@Body() user: User) {
    return this.userService.signup(user);
  }

  @MessagePattern("updatepassword")
  @UseGuards(AuthGuard)
  updatedPassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Request() req: AuthRequest,
  ) {
    return this.userService.updatePassword(updatePasswordDto, req);
  }

  @MessagePattern("login")
  login(@Body() loginDto: LoginDto) {
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
