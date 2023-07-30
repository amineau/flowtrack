import activityService from "@/server/db/service/activity";
import { Prisma } from "@prisma/client";

type Record = {
  timestamp: Date;
  positionLat: number;
  positionLong: number;
  altitude?: number;
  grade?: number;
  distance?: number;
  cadence?: number;
  speed?: number;
  temperature?: number;
  enhancedAltitude?: number;
  enhancedSpeed?: number;
};
type Session = {
  startTime: Date;
  totalDistance: number;
  totalTimerTime: number;
  totalElapsedTime: number;
  totalAscent: number;
  avgSpeed: number;
};

export default {
  calculateGrade: (distance: number[], elevation: number[]) => {
    const grade: number[] = [];
    const smooth = 10;
    for (let i = 0; i < distance.length; i++) {
      if (i < smooth || i > distance.length - smooth) {
        grade.push(0);
      } else {
        grade.push(
          (elevation[i + smooth] - elevation[i - smooth]) /
            (distance[i + smooth] - distance[i - smooth])
        );
      }
    }
    return grade;
  },
  createActivityFromFit: async (fit: any, userId: number) => {
    const fitFieldsMap: any = {
      timestamp: "time",
      enhancedAltitude: "altitude",
      distance: "distance",
      cadence: "cadence",
      enhancedSpeed: "speed",
      temperature: "temperature",
      heartRate: "heartRate",
      grade: "grade",
    };
    const streams: any = {};
    const map: {
      polyline: Array<[number, number]>;
      summaryPolyline: Array<[number, number]>;
    } = {
      polyline: [],
      summaryPolyline: [],
    };
    const session: Session = fit.sessionMesgs.find(
      (s: any) => s.eventType === "stop"
    );
    const hasPosition =
      fit.recordFields.includes("positionLat") &&
      fit.recordFields.includes("positionLong");
    const savedFields = fit.recordFields.filter((x: string) =>
      Object.keys(fitFieldsMap).includes(x)
    );
    console.log({ rec: fit.recordMesgs[0], session });

    fit.recordMesgs.forEach((record: Record) => {
      if (hasPosition) {
        map.polyline.push([
          +(record.positionLat / (2 ** 32 / 360)).toFixed(6),
          +(record.positionLong / (2 ** 32 / 360)).toFixed(6),
        ]);
      }
      savedFields.forEach((field: string) => {
        if (fitFieldsMap[field]) {
          streams[fitFieldsMap[field]] = streams[fitFieldsMap[field]] ?? [];
          streams[fitFieldsMap[field]].push(record[field] ?? null);
        }
      });
    });
    streams.latlng = map.polyline;
    streams.time = streams.time.map(
      (t: Date) => (t.getTime() - session.startTime.getTime()) / 1000
    );
    streams.grade = streams.grade?.map((g: number) => g / 100);
    map.polyline = [...new Set(map.polyline)];
    map.summaryPolyline = map.polyline.filter((_, i) => i % 10 === 0);

    const activity: Prisma.ActivityUncheckedCreateInput = {
      name: "Fit activity",
      distance: session.totalDistance,
      startDateLocal: session.startTime,
      startDate: session.startTime,
      movingTime: session.totalTimerTime,
      elapsedTime: session.totalElapsedTime,
      totalElevationGain: session.totalAscent,
      averageSpeed: session.avgSpeed,
      polyline: map.polyline,
      summaryPolyline: map.summaryPolyline,
      synchronized: true,
      userId,
      streams: {
        create: Object.keys(streams).map((key) => ({
          type: key,
          data: streams[key],
        })),
      },
    };
    return await activityService.create(activity);
  },
};
