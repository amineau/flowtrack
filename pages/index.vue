<template>
  <div class="flex flex-wrap">
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="dark:bg-gray-700 h-72 w-full pt-3 pl-3 m-4 rounded-lg overflow-hidden flex flex-col flex-wrap border shadow-md hover:shadow-lg border-slate-700"
    >
      <div class="w-content basis-1/6 flex justify-between items-center px-8">
        <div
          class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600"
        >
          <span class="font-medium text-gray-600 dark:text-gray-300">AM</span>
        </div>
        <NuxtLink :to="`/activity/${activity.id}`">{{
          activity.name
        }}</NuxtLink>
        <span>{{ toLocaleString(activity.startDate) }}</span>
      </div>
      <div class="basis-5/6 flex">
        <div class="py-3 px-1 basis-1/2 flex flex-wrap content-around">
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Distance</span>
            <span class="mb-2 text-xl font-extrabold"
              >{{ (activity.distance / 1000).toFixed(1) }} km</span
            >
          </div>
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Duration</span>
            <span class="mb-2 text-xl font-extrabold">{{
              toTimeString(activity.movingTime)
            }}</span>
          </div>
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Average Speed</span>
            <span class="mb-2 text-xl font-extrabold"
              >{{ (activity.averageSpeed * 3.6).toFixed(1) }} km/h</span
            >
          </div>
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Elevation Gain</span>
            <span class="mb-2 text-xl font-extrabold"
              >{{ activity.totalElevationGain }} m</span
            >
          </div>
        </div>

        <div class="flex-grow">
          <MapPreviewActivity :activity="activity" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const activities = ref(null);
const center = ref(null);
const boundingBox = ref(null);

const toLocaleString = (date: string) => {
  const dateUTC = new Date(date);
  return dateUTC.toLocaleString();
};

const toTimeString = (second: number) => {
  const dateUTC = new Date(second * 1000);
  return dateUTC.toLocaleTimeString();
};

onBeforeMount(async () => {
  activities.value = await $fetch("/api/activity");
  const ids = activities.value?.map((a) => a.id);
  const centroid = await $fetch(`/api/activity/centroid?ids=${ids}`);
  center.value = centroid.centroid.coordinates;
  boundingBox.value = centroid.boundingBox.coordinates;
});
</script>
