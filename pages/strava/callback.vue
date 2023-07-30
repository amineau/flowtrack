<template></template>
<script setup lang="ts">
const query = useRoute().query;

onBeforeMount(async () => {
  await $fetch("/api/strava/auth/callback", { query });
  navigateTo(useCookie("redirect").value ?? "/");
});

// onBeforeMount(async () => {
//   const cookie = useCookie("redirect");
//   console.log({ server: process.server });
//   console.log("callback", cookie.value);
//   const redirect = ({
//     error,
//   }: { error?: string | LocationQueryValue[] } = {}) => {
//     const redirectTo = cookie.value ?? "/";
//     cookie.value = null;
//     console.log(redirectTo);
//     navigateTo(error ? redirectTo + "?error=" + error : redirectTo);
//   };

//   type StravaConnector = {
//     access_token: LocationQueryValue | LocationQueryValue[];
//     refresh_token: LocationQueryValue | LocationQueryValue[];
//     expires_at: LocationQueryValue | LocationQueryValue[];
//     token_type: LocationQueryValue | LocationQueryValue[];
//     user: number;
//   };

//   if (query.error) {
//     redirect({ error: query.error });
//   }

//   [
//     "access_token",
//     "refresh_token",
//     "raw[expires_at]",
//     "raw[token_type]",
//   ].forEach((key) => {
//     if (!query[key]) {
//       redirect({ error: `Missing ${key} in query` });
//     }
//   });

//   // TODO: create connect method in strapi-connector intead of this
//   // to bypass permission issue #relou
//   await create<StravaConnector>("strava-connectors", {
//     // Need find permission in users_permission::user
//     user: user.value?.id,
//     access_token: query.access_token,
//     refresh_token: query.refresh_token,
//     expires_at: query["raw[expires_at]"],
//     token_type: query["raw[token_type]"],
//   });

//   redirect();
</script>
