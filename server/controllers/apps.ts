import stravaController from "./strava";

import type { AppToken } from "@prisma/client";

export default {
  getAccessToken: async (appToken: AppToken): Promise<string> => {
    if (appToken.expiresAt && appToken.expiresAt < new Date()) {
      appToken = await stravaController.refreshToken(appToken);
    }
    return appToken.accessToken;
  },
};
