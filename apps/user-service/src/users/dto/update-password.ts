/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, MinLength, Matches } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: "Password must contain at least one letter and one number",
  })
  newPassword: string;

  @IsString()
  newPasswordConfirm: string;
}
