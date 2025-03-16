/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { CreateUserDto } from "src/user/dto/user.dto";
import { lastValueFrom } from "rxjs";
import { ClientProxy } from "@nestjs/microservices";

export interface AuthRequest extends Request {
  user?: CreateUserDto;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject("USER_CLIENT") private readonly userClient: ClientProxy,
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
      // verify token and Check if user still exists
      const user = await lastValueFrom(
        this.userClient.send("verify_token", { token }),
      );
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
