/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { promisify } from "node:util";
import * as jwt from "jsonwebtoken";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { User } from "../users/schema/user.schema";

export interface AuthRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const authorization = req.headers?.authorization;
    let token: string | null = null;

    // Extract token from header or cookie
    if (authorization?.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new UnauthorizedException("You are not logged in! Please log in.");
    }
    try {
      // 2) Verification token
      const decoded: jwt.JwtPayload = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
      );

      // 3) Check if user still exists
      const user = await this.userModel.findOne({
        _id: decoded.id,
        isActive: true,
      });

      if (!user) {
        throw new NotFoundException(
          "This user account is deactivated or does not exist.",
        );
      }
      // Attach user to request
      req.user = user;
      return true;
    } catch (error) {
      console.log("err", error);

      throw new BadRequestException("Invalid or expired token.");
    }
  }
}
