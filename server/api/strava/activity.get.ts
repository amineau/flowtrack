import strava from "strava-v3";
import db from "@/server/db";
import polyline from "@mapbox/polyline";

export default defineEventHandler(async (event) => {
  console.log(event.context);
  const accessToken = event.context.session?.accessToken;
  const list = await strava.athlete.listActivities({
    access_token: accessToken,
    per_page: 50,
  });
  let imported = 0;
  for (const activity of list) {
    if (
      !(await db.models.Activity.findOne({
        where: { stravaId: activity.id.toString() },
      }))
    ) {
      const response = await strava.activities.get({
        access_token: accessToken,
        id: activity.id,
        // "types": "distance,time,latlng,altitude,velocity_smooth,heartrate,cadence,watts,temp,moving,grade_smooth",
        // "series_type": "time"
      });
      await db.models.Activity.create({
        stravaId: response.id.toString(),
        name: response.name,
        distance: response.distance,
        startDate: response.start_date_local,
        movingTime: response.moving_time,
        elapsedTime: response.elapsed_time,
        totalElevationGain: response.total_elevation_gain,
        averageSpeed: response.average_speed,
        polyline: {
          type: "LineString",
          coordinates: polyline.decode(response.map.polyline),
        },
      });
      imported++;
    }
  }

  return { activities_imported: imported };
});
