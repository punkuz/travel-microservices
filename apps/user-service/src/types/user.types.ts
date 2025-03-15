import { Document } from "mongoose";

export interface UserInterface extends Document {
  name: string;
  username: string;
  email: string;
  role: "user" | "admin";
  password?: string; // Make password optional in the interface
  passwordConfirm?: string; // Make passwordConfirm optional
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;

  // Methods - these are not part of the data structure, but rather the instance
  correctPassword(
    candidatePassword: string | Buffer,
    userPassword: string,
  ): Promise<boolean>;
  createPasswordResetToken(): string;
}
