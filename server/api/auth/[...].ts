import StravaProvider from "next-auth/providers/strava";
import { NuxtAuthHandler } from "#auth";
import type { Account, Session } from "next-auth";
import type { StravaProfile } from "next-auth/providers/strava";
import type { JWT } from "next-auth/jwt";
import db from "@/server/db";

const config = useRuntimeConfig();
export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: `${config.secret}`,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    StravaProvider.default({
      clientId: `${config.stravaClientId}`,
      clientSecret: `${config.stravaClientSecret}`,
      authorization: {
        url: "https://www.strava.com/api/v3/oauth/authorize",
        params: {
          scope: "read_all,profile:read_all,activity:read_all",
          approval_prompt: "auto",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: JWT;
      account: Account | null;
    }): Promise<JWT> {
      if (account) {
        token = Object.assign({}, token, {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        });
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session) {
        session = Object.assign({}, session, {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        });
      }
      return session;
    },
    async signIn({
      profile,
    }: {
      profile: StravaProfile;
    }): Promise<string | boolean> {
      db.models.User.findOrCreate({
        where: {
          stravaId: profile.id,
        },
        defaults: {
          firstname: profile.firstname,
          lastname: profile.lastname,
          stravaId: profile.id,
        },
      }).then(([user, created]: [Model, boolean]) => {
        user.lastLogin = new Date();
        user.save();
      });
      return true;
    },
  },
});
