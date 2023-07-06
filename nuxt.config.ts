// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@sidebase/nuxt-auth",
    "@pinia/nuxt",
    "@nuxtjs/strapi",
    "@nuxtjs/tailwindcss",
    "nuxt-highcharts",
  ],
  strapi: {
    url: process.env.STRAPI_URL || "http://localhost:1337",
    prefix: "/api",
    version: "v4",
    cookie: {},
    cookieName: "strapi_jwt",
  },
  auth: {
    // baseURL: process.env.AUTH_ORIGIN,
    // provider: {
    //   type: "authjs",
    //   defaultProvider: "strava",
    // },
    baseURL: (process.env.STRAPI_URL || "http://localhost:1337") + "/api/auth",
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/local", method: "post" },
        signOut: undefined,
        signUp: { path: "/local/register", method: "post" },
        getSession: undefined,
      },
    },
    // globalAppMiddleware: true,
  },
  runtimeConfig: {
    stravaClientId: "",
    stravaClientSecret: "",
    secret: "123",
    public: {},
  },
});
