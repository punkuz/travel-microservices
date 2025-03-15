import { Request } from "express";
import { CreateUserDto } from "../dto/user.dto";

export interface AuthRequest extends Request {
  user?: CreateUserDto;
}
