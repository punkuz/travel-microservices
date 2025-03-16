/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// api-gateway/src/auth/auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject("USER_CLIENT") private readonly userClient: ClientProxy,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let token: string;
    const authorization = req.headers.authorization;
    // Extract token from header or cookie
    if (authorization?.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    } else {
      return next(new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED));
    }
    token = authorization.split(" ")[1];

    try {
      const userData = await lastValueFrom(
        this.userClient.send("verify_token", { token }),
      );

      req.headers["x-user-id"] = userData._id;
      req.headers["x-user-role"] = userData.role;
      next();
    } catch (error) {
      next(new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED));
    }
  }
}
