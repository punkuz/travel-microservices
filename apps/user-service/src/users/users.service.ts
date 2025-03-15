import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { createSendToken } from "src/extra/jwt-token";
import { UpdatePasswordDto } from "./dto/update-password";
import { AuthRequest } from "src/guards/auth.guard";
import { UserInterface } from "src/types/user.types";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async signup(data: User) {
    try {
      const user = await this.userModel.create(data);
      return createSendToken(user);
    } catch (error) {
      console.log("err", error);
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        err: error.message,
        message: "something went wrong",
      };
    }
  }

  /* 
    @desc Post Login
    @route POST /api/v1/users/login
    @access private
**/
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1) Check if email and password exist
    if (!email || !password) {
      throw new BadRequestException("Please provide email and password!");
    }
    // 2) Check if user exists && password is correct
    const user = await this.userModel.findOne({ email }).select("+password");

    if (
      !user ||
      !(await (user as unknown as UserInterface).correctPassword(
        password,
        user.password,
      ))
    ) {
      throw new BadRequestException("Incorrect email or password");
    }

    //update last login
    user.lastLogin = Date.now() as unknown as Date;
    await user.save({ validateBeforeSave: false });

    // 3) If everything ok, send token to client
    return createSendToken(user);
  }

  /* 
  @desc Update user password
  @route /api/v1/user/updatemypassword
  @access private
**/
  async updatePassword(body: UpdatePasswordDto, req: AuthRequest) {
    // 1) Get user from collection
    const user = await this.userModel
      .findById(req.user?.id)
      .select("+password");

    if (!user) {
      throw new BadRequestException("User not found."); // Handle the case where the user is not found
    }

    // 2) Check if provided current password is correct
    if (
      !(await (user as unknown as UserInterface).correctPassword(
        body.currentPassword,
        user.password,
      ))
    ) {
      throw new BadRequestException("Your current password is wrong.");
    }

    // 3) If so, update password
    user.password = body.newPassword;
    user.passwordConfirm = body?.newPasswordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    return createSendToken(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find();
  }
}
