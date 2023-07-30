import prisma from "@/server/db/prisma";
import { Prisma } from "@prisma/client";

export default {
  create: (appToken: Prisma.AppTokenUncheckedCreateInput) => {
    return prisma.appToken.create({
      data: appToken,
    });
  },
  delete: (appName: string, userId: number) => {
    return prisma.appToken.delete({
      where: {
        appName_userId: {
          appName,
          userId,
        },
      },
    });
  },
  update: (id: number, appToken: Prisma.AppTokenUncheckedUpdateInput) => {
    return prisma.appToken.update({
      where: {
        id,
      },
      data: appToken,
    });
  },
  getByAppName: (appName: string, userId: number) => {
    return prisma.appToken.findUniqueOrThrow({
      where: {
        appName_userId: {
          appName,
          userId,
        },
      },
    });
  },
};
