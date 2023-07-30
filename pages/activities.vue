<template>
  <div class="flex flex-wrap">
    <div
      v-for="activity in activities"
      :key="activity.id"
      class="h-72 w-full m-4 rounded-lg overflow-hidden flex flex-col flex-wrap shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-xl"
    >
      <div
        class="w-content basis-1/6 flex justify-between items-center px-8 border-b bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
      >
        <UserAvatar :user="activity.user" />
        <NuxtLink
          :to="`/activity/${activity.id}`"
          class="text-gray-500 dark:text-gray-400"
          >{{ activity.name }}</NuxtLink
        >
        <span class="text-gray-500 dark:text-gray-400">{{
          activity.startDateLocal
        }}</span>
      </div>
      <div class="basis-5/6 flex">
        <div class="py-3 px-1 basis-1/2 flex flex-wrap content-around">
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Distance</span>
            <span
              class="mb-2 text-xl font-extrabold text-gray-900 dark:text-gray-100"
              >{{ (activity.distance / 1000).toFixed(1) }} km</span
            >
          </div>
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Duration</span>
            <span
              class="mb-2 text-xl font-extrabold text-gray-900 dark:text-gray-100"
              >{{ toTimeString(activity.movingTime) }}</span
            >
          </div>
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Average Speed</span>
            <span
              class="mb-2 text-xl font-extrabold text-gray-900 dark:text-gray-100"
              >{{ (activity.averageSpeed * 3.6).toFixed(1) }} km/h</span
            >
          </div>
          <div
            class="flex flex-col-reverse justify-between items-center basis-1/2"
          >
            <span class="text-gray-500 dark:text-gray-400">Elevation Gain</span>
            <span
              class="mb-2 text-xl font-extrabold text-gray-900 dark:text-gray-100"
              >{{ activity.totalElevationGain }} m</span
            >
          </div>
        </div>

        <div class="flex-grow">
          <MapPreviewActivity :activity="activity" />
        </div>
      </div>
    </div>
    <Observer @intersect="getActivities" />
  </div>
</template>

<script lang="ts" setup>
import type { Activity, User } from "@prisma/client";

const cursor: Ref<number | null> = ref(null);
const activities: Ref<(Activity & { user: User })[]> = ref([]);

const toLocaleString = (date: string) => {
  const dateUTC = new Date(date);
  return dateUTC.toLocaleString();
};

const toTimeString = (second: number) => {
  const dateUTC = new Date(second * 1000);
  return dateUTC.toLocaleTimeString();
};

const { data } = await useFetch("/api/activity", {
  query: { take: 3, include: { user: true } },
});
activities.value = data.value;
if (data.value?.length) {
  cursor.value = data.value[data.value.length - 1]?.id;
}

const getActivities = async () => {
  const { data } = await useFetch("/api/activity", {
    query: { take: 5, cursorId: cursor.value, include: { user: true } },
  });
  if (!data.value?.length) return;
  cursor.value = data.value[data.value.length - 1]?.id;
  activities.value = [...activities.value, ...data.value];
};
</script>
