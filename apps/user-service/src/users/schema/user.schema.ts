/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import crypto from "node:crypto";
import * as bcrypt from "bcrypt";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import validator from "validator";
import { Document } from "mongoose";
import { Role } from "../../types/role.enum";

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    maxlength: 20,
    minlength: 6,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email: string) => validator.isEmail(email), // Mongoose validation
      message: "Please provide a valid email",
    },
  })
  email: string;

  @Prop({
    enum: Role,
    required: [true, "Please provide a role"],
    default: "user",
  })
  role: string;

  @Prop({
    required: true,
    minlength: 8,
    maxlength: 50,
    select: false,
  })
  password: string;

  @Prop({
    required: true,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (this: User, passwordConfirm: string) {
        return passwordConfirm === this.password;
      },
      message: "Passwords do not match!",
    },
  })
  passwordConfirm?: string;

  @Prop()
  passwordChangedAt: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop()
  lastLogin: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

// Generate Schema
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  try {
    // Hash the password with cost of 12
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword: string | Buffer,
  userPassword: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};
