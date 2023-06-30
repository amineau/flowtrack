import { createRouter, defineEventHandler, useBase } from "h3";
import db from "@/server/db";

const router = createRouter();

router.get(
  "/centroid",
  defineEventHandler(async (event) => {
    const { ids } = getQuery(event);

    if (!ids) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing ids",
      });
    }
    const array_ids = ids.split(",");
    if (array_ids.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Ids must not be empty",
      });
    }
    const res = await db.models.Activity.findOne({
      where: { id: array_ids },
      attributes: [
        [
          db.sequelize.literal("ST_Centroid(ST_Extent(polyline)::geometry)"),
          "centroid",
        ],
        [db.sequelize.literal("ST_Extent(polyline)::geometry"), "boundingBox"],
      ],
    });
    return res;
  })
);

router.get(
  "/:id",
  defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    if (isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid id",
      });
    }

    const activity = await db.models.Activity.findOne({
      where: { id },
      attributes: [
        "id",
        "name",
        "distance",
        "startDate",
        "movingTime",
        "elapsedTime",
        "totalElevationGain",
        "averageSpeed",
        "polyline",
        [db.sequelize.literal("ST_Centroid(polyline)"), "centroid"],
        [db.sequelize.literal("ST_Extent(polyline)::geometry"), "boundingBox"],
      ],
      group: ["id"],
    });
    if (!activity) {
      throw createError({
        statusCode: 404,
        statusMessage: "Activity not found",
      });
    }
    return activity;
  })
);

router.get(
  "/:id/stream",
  defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    if (isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid id",
      });
    }

    const streams = await db.models.Stream.findAll({
      where: { ActivityId: id },
      attributes: ["type", "data"],
    });
    if (streams.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Activity not found",
      });
    }
    return streams;
  })
);

export default useBase("/api/activity", router.handler);
