import db from "@/server/db";

interface Query {
  page?: number;
  per_page?: number;
}

export default defineEventHandler(async (event) => {
  const { page = 1, per_page = 0 }: Query = getQuery(event);

  const activities = await db.models.Activity.findAll({
    ...(per_page > 0 && {
      limit: per_page,
      offset: (Math.max(1, page) - 1) * per_page,
    }),
    attributes: [
      "id",
      "name",
      "distance",
      "startDate",
      "movingTime",
      "elapsedTime",
      "totalElevationGain",
      "averageSpeed",
      [
        db.sequelize.literal("ST_SimplifyPreserveTopology(polyline, 0.0005)"),
        "polyline",
      ],
      [db.sequelize.literal("ST_Centroid(polyline)"), "centroid"],
      [db.sequelize.literal("ST_Extent(polyline)::geometry"), "boundingBox"],
    ],
    sort: ["startDate"],
    group: ["id"],
  });
  // meta: await db.models.Activity.findOne({
  //   attributes: [
  //     [db.sequelize.literal("ST_Extent(polyline)::geometry"), "boundingBox"],
  //     [
  //       db.sequelize.literal("ST_Centroid(ST_Extent(polyline)::geometry)"),
  //       "centroid",
  //     ],
  //   ],
  // }),

  return activities;
});
