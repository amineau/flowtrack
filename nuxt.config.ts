// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "nuxt-highcharts",
    "@nuxt/devtools",
    "@pinia/nuxt",
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
  ],

  devtools: {
    // Enable devtools (default: true)
    enabled: false,
    // VS Code Server options
    vscode: {},
  },

  auth: {
    baseURL: "/api/auth",
    provider: {
      type: "local",
      pages: {
        login: "/user/login",
      },
      endpoints: {
        signIn: { path: "/login", method: "post" },
        signOut: { path: "/logout", method: "post" },
        signUp: { path: "/register", method: "post" },
        getSession: { path: "/session", method: "get" },
      },
      token: {
        signInResponseTokenPointer: "/token",
        type: "Bearer",
        headerName: "Authorization",
        maxAgeInSeconds: 60 * 60 * 24, // 24 hours
      },
    },
    globalAppMiddleware: true,
  },
  runtimeConfig: {
    stravaClientId: "",
    stravaClientSecret: "",
    secret: "123",
    public: {},
  },
});
