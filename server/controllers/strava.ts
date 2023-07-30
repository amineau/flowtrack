import strava from "strava-v3";
import appService from "@/server/db/service/app";
import type { AppToken } from "@prisma/client";

strava.config({
  access_token: "",
  client_id: useRuntimeConfig().stravaClientId,
  client_secret: useRuntimeConfig().stravaClientSecret,
  redirect_uri: "http://localhost:3000/strava/callback",
});

const scopes = "read_all,profile:read_all,activity:read_all";

export default {
  getRequestAccessURL: () => {
    return strava.oauth.getRequestAccessURL({
      scope: scopes,
    });
  },
  getToken: async (code: string, userId: number) => {
    const token = await strava.oauth.getToken(code);
    return await appService.create({
      appName: "strava",
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: new Date(token.expires_at * 1000),
      tokenType: token.token_type,
      userId,
    });
  },
  refreshToken: async (appToken: AppToken) => {
    const token = await strava.oauth.refreshToken(appToken.refreshToken);
    return await appService.update(appToken.id, {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: new Date(token.expires_at * 1000),
      tokenType: token.token_type,
    });
  },
  deauthorize: (appToken: AppToken) => {
    return strava.oauth.deauthorize({
      access_token: appToken.accessToken,
    });
  },
};
