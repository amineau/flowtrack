import { createRouter, useBase } from "h3";
import strava from "strava-v3";
import appService from "@/server/db/service/app";
import stravaController from "@/server/controllers/strava";

const router = createRouter();

router.get(
  "/authorize",
  defineWrappedResponseHandler(async (event) => {
    const requestAccessUrl = await stravaController.getRequestAccessURL();
    return { requestAccessUrl };
  })
);

router.get(
  "/callback",
  defineWrappedResponseHandler(async (event) => {
    const code: string | null = getQuery(event).code?.toString() ?? null;
    if (!code) {
      throw createError({
        statusCode: 403,
        statusMessage: "Code not found",
      });
    }
    await stravaController.getToken(code, event.context.session.user.id);
    return {};
  })
);

router.post(
  "/deauthorize",
  defineWrappedResponseHandler(async (event) => {
    const appToken = await appService.delete(
      "strava",
      event.context.session.user.id
    );
    await stravaController.deauthorize(appToken);
    return { success: true };
  })
);

router.get(
  "/session",
  defineWrappedResponseHandler(async (event) => {
    console.log("/strava/session");
    const appToken = await appService.getByAppName(
      "strava",
      event.context.session.user.id
    );
    return { session: appToken };
  })
);

export default useBase("/api/strava/auth", router.handler);
