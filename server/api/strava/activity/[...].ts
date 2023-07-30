import strava from "strava-v3";
import type { DetailedActivityResponse } from "strava-v3";
import { createRouter, useBase } from "h3";
import appService from "@/server/db/service/app";
import activityService from "@/server/db/service/activity";
import polyline from "@mapbox/polyline";
import { Prisma } from "@prisma/client";
import AppController from "@/server/controllers/apps";
import ActivityController from "@/server/controllers/activity";

type StravaStream = {
  original_size: number;
  resolution: string;
  type: string;
  data: any[];
};

const router = createRouter();

const getActivities = async (accessToken: string, max?: number) => {
  let activities: DetailedActivityResponse[] = [];
  let page = 1;
  const per_page = max && max <= 200 ? max : 200;
  let result = await strava.athlete.listActivities({
    access_token: accessToken,
    per_page,
    page,
  });
  while (result.length > 0 && (!max || activities.length < max)) {
    activities = activities.concat(result);
    page++;
    result = await strava.athlete.listActivities({
      access_token: accessToken,
      per_page:
        max && max - activities.length < per_page
          ? max - activities.length
          : per_page,
      page,
    });
  }
  return activities;
};

router.post(
  "/synchronize",
  defineWrappedResponseHandler(async (event) => {
    const appToken = await appService.getByAppName(
      "strava",
      event.context.session.user.id
    );
    if (!appToken) {
      throw createError({
        statusCode: 403,
        statusMessage: "Strava app token not found",
      });
    }
    const accessToken = await AppController.getAccessToken(appToken);
    const localActivities = await activityService.getByAppName(
      event.context.session.user.id,
      "strava"
    );
    const stravaActivities = await getActivities(accessToken);
    const activities: Prisma.ActivityCreateManyInput[] = [];

    for (const stravaActivity of stravaActivities) {
      if (
        !localActivities.find(
          (localActivity) =>
            localActivity.externalId === stravaActivity.id.toString()
        )
      ) {
        activities.push({
          externalId: stravaActivity.id.toString(),
          name: stravaActivity.name,
          distance: stravaActivity.distance,
          startDateLocal: stravaActivity.start_date_local,
          startDate: stravaActivity.start_date,
          movingTime: stravaActivity.moving_time,
          elapsedTime: stravaActivity.elapsed_time,
          totalElevationGain: stravaActivity.total_elevation_gain,
          averageSpeed: stravaActivity.average_speed,
          summaryPolyline: polyline.decode(
            stravaActivity.map?.summary_polyline || ""
          ),
          userId: event.context.session.user.id,
          appTokenId: appToken.id,
        });
      }
    }
    await activityService.createMany(activities);
    return { success: true };
  })
);

router.get(
  "/diff",
  defineWrappedResponseHandler(async (event) => {
    const appToken = await appService.getByAppName(
      "strava",
      event.context.session.user.id
    );
    if (!appToken) {
      throw createError({
        statusCode: 403,
        statusMessage: "Strava app token not found",
      });
    }
    const maxParam = getRouterParam(event, "max") || "10";
    const max = parseInt(maxParam);
    const accessToken = await AppController.getAccessToken(appToken);
    const localActivities = await activityService.getByAppName(
      event.context.session.user.id,
      "strava"
    );
    const stravaActivities = await getActivities(accessToken, max);
    const localActivityIds = localActivities.map(
      (activity) => activity.externalId
    );
    const newActivities = stravaActivities.filter(
      ({ id }) => !localActivityIds.includes(`${id}`)
    );
    return {
      data: newActivities.map((activity) => activity.id),
      count: newActivities.length,
      hasMore: stravaActivities.length >= max,
    };
  })
);

router.post(
  "/:id/synchronize",
  defineWrappedResponseHandler(async (event) => {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing id",
      });
    }
    const localActivity = await activityService.getById(
      event.context.session.user.id,
      parseInt(id)
    );
    if (!localActivity) {
      throw createError({
        statusCode: 404,
        statusMessage: "Activity not found",
      });
    }
    if (localActivity.synchronized) {
      throw createError({
        statusCode: 403,
        statusMessage: "Activity already synchronized",
      });
    }
    const appToken = await appService.getByAppName(
      "strava",
      event.context.session.user.id
    );
    if (!appToken) {
      throw createError({
        statusCode: 403,
        statusMessage: "Strava app token not found",
      });
    }
    const accessToken = await AppController.getAccessToken(appToken);
    const stravaActivity = await strava.activities.get({
      access_token: accessToken,
      id: localActivity.externalId,
    });
    if (!stravaActivity) {
      throw createError({
        statusCode: 404,
        statusMessage: "Strava activity not found",
      });
    }
    const stravaStreams: StravaStream[] = await strava.streams.activity({
      access_token: accessToken,
      id: localActivity.externalId,
      types: [
        "latlng",
        "altitude",
        "time",
        "distance",
        "velocity_smooth",
        "heartrate",
        "cadence",
        "temp",
      ],
    });
    const gradeStream = ActivityController.calculateGrade(
      stravaStreams.find((stream) => stream.type === "distance")?.data || [],
      stravaStreams.find((stream) => stream.type === "altitude")?.data || []
    );
    stravaStreams.push({
      original_size: gradeStream.length,
      resolution: "high",
      type: "grade",
      data: gradeStream,
    });
    return await activityService.updateStreams(
      event.context.session.user.id,
      localActivity.id,
      stravaActivity.map?.polyline || "",
      stravaStreams.map(
        (stream) =>
          ({
            type: stream.type,
            data: stream.data,
          } as Prisma.StreamCreateWithoutActivityInput)
      )
    );
  })
);

export default useBase("/api/strava/activity", router.handler);
