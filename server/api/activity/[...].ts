import { createRouter, useBase } from "h3";
import activityService from "@/server/db/service/activity";
import activityController from "@/server/controllers/activity";
import Fit from "@/server/utils/fit";
const router = createRouter();

router.post(
  "/import",
  defineWrappedResponseHandler(async (event) => {
    const content = await readMultipartFormData(event);
    console.log(event.node.req.headers["content-type"]);
    if (!content) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing file",
      });
    }
    if (content[0].type !== "image/fits") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid file type",
      });
    }
    console.log(content[0].filename, content[0].type);

    const fitContent = await Fit.decode(content[0].data);
    const activity = await activityController.createActivityFromFit(
      fitContent,
      event.context.session.user.id
    );
    return { success: activity };
  })
);

router.get(
  "/:id",
  defineWrappedResponseHandler(async (event) => {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing id",
      });
    }

    const activity = await activityService.getById(
      event.context.session.user.id,
      parseInt(id)
    );
    if (!activity) {
      throw createError({
        statusCode: 404,
        statusMessage: "Activity not found",
      });
    }
    return activity;
  })
);

export default useBase("/api/activity", router.handler);
