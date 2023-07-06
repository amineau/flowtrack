import { defineStore } from "pinia";

export const useStore = defineStore("main", {
  state: () => ({
    auth: {
      loggedIn: false,
      user: null,
    },
  }),
  getters: {
    isAuthenticated: (state) => state.auth.loggedIn,
    loggedInUser: (state) => state.auth.user,
  },
});
