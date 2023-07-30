import prisma from "~/server/db/prisma";

export default {
  getById: async (id: number) => {
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  },
  getByEmail: async (email: string) => {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return result;
  },
};
