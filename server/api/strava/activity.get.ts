import strava from "strava-v3";
import type { DetailedActivityResponse } from "strava-v3";
import db from "@/server/db";
import polyline from "@mapbox/polyline";

const getActivities = async (accessToken: string) => {
  return await strava.athlete.listActivities({
    access_token: accessToken,
    per_page: 5,
  });
};

const syncActivity = async (
  detailedActivity: DetailedActivityResponse,
  accessToken: string,
  transaction: any
) => {
  const activity_instance = await db.models.Activity.create(
    {
      stravaId: detailedActivity.id.toString(),
      name: detailedActivity.name,
      distance: detailedActivity.distance,
      startDate: detailedActivity.start_date_local,
      movingTime: detailedActivity.moving_time,
      elapsedTime: detailedActivity.elapsed_time,
      totalElevationGain: detailedActivity.total_elevation_gain,
      averageSpeed: detailedActivity.average_speed,
      polyline: {
        type: "LineString",
        coordinates: polyline.decode(detailedActivity.map?.polyline),
      },
    },
    { transaction }
  );
  const streams = await strava.streams.activity({
    id: detailedActivity.id,
    types: db.models.Stream.rawAttributes.type.values,
    access_token: accessToken,
  });
  for (const stream of streams) {
    await db.models.Stream.create(
      {
        type: stream.type,
        data: stream.data,
        ActivityId: activity_instance.id,
      },
      { transaction }
    );
  }
};

export default defineEventHandler(async (event) => {
  const accessToken = event.context.session?.accessToken;
  const activities = await getActivities(accessToken);
  let imported = 0;
  await db.sequelize.transaction(async (t) => {
    for (const activity of activities) {
      if (
        !(await db.models.Activity.findOne({
          where: { stravaId: activity.id.toString() },
        }))
      ) {
        const detailedActivity: DetailedActivityResponse =
          await strava.activities.get({
            access_token: accessToken,
            id: activity.id,
          });
        await syncActivity(detailedActivity, accessToken, t);
        imported++;
      }
    }
  });

  return { activities_imported: imported };
});
