<template></template>
<script setup lang="ts">
const response = await $fetch("/api/strava/auth/authorize");

navigateTo(response.requestAccessUrl, { external: true });
</script>
