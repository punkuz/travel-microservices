import * as jwt from "jsonwebtoken";

//Generate a token using JWT
//@return token
const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET ?? "sec";
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Return token response
export const createSendToken = (user: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const id: any = user._id;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const token = signToken(id);

  // Remove password from output
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  user.password = undefined;

  return {
    token,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    user,
  };
};
