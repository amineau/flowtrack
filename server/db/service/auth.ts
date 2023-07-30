import prisma from "~/server/db/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

type LoginUser = {
  email: string;
  password: string;
};

type UserOutput = {
  id: number;
  email: string;
  username: string;
  lastLogin: Date;
};

export default {
  register: async (user: Prisma.UserCreateInput) => {
    const { email, username } = user;
    const password = await bcrypt.hash(user.password, SALT_ROUNDS);
    const result = await prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });
    return result;
  },
  login: async (user: LoginUser) => {
    const { email, password } = user;
    const error = new Error("Invalid email or password");
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!result) {
      throw error;
    }
    const isValid = await bcrypt.compare(password, result.password);
    if (!isValid) {
      throw error;
    }
    await prisma.user.update({
      where: {
        id: result.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
    return result;
  },
  createSession: async (userId: number) => {
    const result = await prisma.session.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return result;
  },
  getUser: async (token: string | undefined): Promise<UserOutput | null> => {
    const result = await prisma.session.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
    return (result?.user as UserOutput) || null;
  },
  deleteSession: async (token: string) => {
    const result = await prisma.session.delete({
      where: {
        token,
      },
    });
    return result;
  },
};
