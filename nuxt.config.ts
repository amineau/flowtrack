// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@element-plus/nuxt", "@sidebase/nuxt-auth"],
  elementPlus: {
    /** Options */
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
      defaultProvider: "strava",
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
