/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength, Matches, IsEmail } from "class-validator";

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: "Password must contain at least one letter and one number",
  })
  password: string;
}
