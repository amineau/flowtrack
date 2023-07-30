import prisma from "@/server/db/prisma";
import { Prisma } from "@prisma/client";
import type { Stream, Activity } from "@prisma/client";
import polyline from "@mapbox/polyline";

export default {
  create(activity: Prisma.ActivityUncheckedCreateInput): Promise<Activity> {
    return prisma.activity.create({
      data: activity,
    });
  },
  createMany(
    activities: Prisma.ActivityCreateManyInput[]
  ): Promise<Prisma.BatchPayload> {
    return prisma.activity.createMany({
      data: activities,
    });
  },
  getById(userId: number, id: number): Promise<Activity | null> {
    return prisma.activity.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        streams: true,
      },
    });
  },
  getByUserId(
    userId: number,
    {
      take,
      cursorId,
      include,
    }: { take?: number; cursorId?: number; include?: Prisma.ActivityInclude }
  ): Promise<Activity[]> {
    let cursor;
    let skip;
    if (take && cursorId) {
      cursor = { id: cursorId };
      skip = 1;
    }
    return prisma.activity.findMany({
      take,
      skip,
      cursor,
      orderBy: {
        startDate: "desc",
      },
      where: {
        userId,
      },
      include,
    });
  },
  getByAppName(userId: number, appName: string): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        userId,
        appToken: {
          appName,
        },
      },
    });
  },
  getByUserIdAndDate(userId: number, date: Date): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        userId,
        startDate: {
          gte: date,
        },
      },
    });
  },
  getByUserIdAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        userId,
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },
  updateStreams(
    userId: number,
    id: number,
    polylineDetailed: string,
    streams: Prisma.StreamCreateWithoutActivityInput[]
  ): Promise<Activity> {
    return prisma.activity.update({
      where: {
        id,
        userId,
      },
      data: {
        synchronized: true,
        polyline: polyline.decode(polylineDetailed),
        streams: {
          createMany: {
            data: streams,
          },
        },
      },
      include: {
        streams: true,
      },
    });
  },
};
