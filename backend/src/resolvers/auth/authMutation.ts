import { Op } from "sequelize";
import { SignupInput, AuthPayload, LoginInput } from "../../generated/graphql-types";
import { User } from "../../models/UserModel";
import { ConflictError, UnauthorizedError } from "../../utils/error/customErrors";
import { loginSchema, signupSchema } from "../../validation/auth";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import { parseOrBadRequest } from "../../utils/zod/parseOrBadRequest";
import bcrypt from "bcrypt";

export const signup = async (
  _parent: unknown,
  args: { args: SignupInput; },
  _context: unknown
): Promise<AuthPayload> => {
  const parsed = parseOrBadRequest(signupSchema, args.args);

  const userName = parsed.userName.trim().toLowerCase();
  const email = parsed.email.trim().toLowerCase();
  const password = parsed.password;
  const firstName = parsed.firstName.trim();
  const lastName = parsed.lastName.trim();

  const existing = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { userName }
      ]
    }
  });
  if (existing) {
    if (existing.email === email) throw new ConflictError("Email already in use");
    if (existing.userName === userName) throw new ConflictError("Username already in use");
  }

  const user = await User.create({
    userName,
    email,
    password,
    firstName,
    lastName,
  });

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' });

  return {
    user,
    token
  };

};

export const login = async (
  _parent: unknown,
  args: { args: LoginInput; },
  _context: unknown
): Promise<AuthPayload> => {
  const parsed = parseOrBadRequest(loginSchema, args.args);

  const email = parsed.email.trim().toLowerCase();
  const password = parsed.password;

  const user = await User.findOne({ where: { email } });
  if (!user) throw new UnauthorizedError("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedError("Invalid credentials");

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' });
  return {
    user,
    token
  };
};