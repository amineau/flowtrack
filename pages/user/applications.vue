<template>
  <div class="min-w-full py-20">
    <h1 class="text-2xl pb-6">Applications</h1>
    <div
      class="flex items-center justify-between py-6 px-4 border-y-2 border-slate-200 dark:border-slate-600"
    >
      <div class="flex flex-col">
        <div class="flex items-center">
          <svg
            class="mr-2 w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Strava"
            role="img"
            viewBox="0 0 512 512"
            width="64px"
            height="64px"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <rect width="512" height="512" rx="15%" fill="#fc4c01"></rect>
              <path
                fill="#ffffff"
                d="M120 288L232 56l112 232h-72l-40-96-40 96z"
              ></path>
              <path
                fill="#fda580"
                d="M280 288l32 72 32-72h48l-80 168-80-168z"
              ></path>
            </g>
          </svg>
          <div class="relative">
            <span class="text-xl">Strava</span>
            <span
              v-if="stravaSession"
              class="absolute top-5 start-0 text-sm text-green-500"
              >Connected
            </span>
          </div>
        </div>
      </div>
      <div>
        <svg
          v-if="!stravaSession"
          @click="connectToStrava"
          class="m-4 w-6 h-6 hover:cursor-pointer text-gray-800 hover:text-green-600 dark:hover:text-green-600 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 15"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M1 7.5h11m0 0L8 3.786M12 7.5l-4 3.714M12 1h3c.53 0 1.04.196 1.414.544.375.348.586.82.586 1.313v9.286c0 .492-.21.965-.586 1.313A2.081 2.081 0 0 1 15 14h-3"
          />
        </svg>
        <div v-else class="flex items-center">
          <div class="relative w-60 h-10">
            <span
              v-show="createdFrom"
              class="text-sm absolute text-gray-600 dark:text-slate-400"
              :class="{
                'top-10': diffActivities.count,
                'top-3': !diffActivities.count,
              }"
              >last synchronization {{ createdFrom }}</span
            >
            <button
              v-show="diffActivities.count"
              @click="synchronizeActivities"
              type="button"
              class="text-sm z-10 text-white bg-[#fc5200] hover:bg-[#fc5200]/90 focus:ring-4 focus:ring-[#fc5200]/50 font-medium focus:outline-none px-5 py-2.5 rounded-lg dark:focus:ring-[#fc5200]/50 dark:hover:bg-[#fc5200]/30"
            >
              Synchronize {{ diffActivities.count
              }}<span v-if="diffActivities.hasMore">+</span> new
              {{ diffActivities.count > 1 ? "activities" : "activity" }}
            </button>
          </div>
          <svg
            @click="disconnectToStrava"
            class="m-4 w-6 h-6 hover:cursor-pointer text-gray-800 hover:text-red-600 dark:hover:text-red-600 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
            />
          </svg>
          <!-- <button
            type="button"
            @click="refreshToken"
            class="flex justify-center items-center text-sm text-white bg-[#fc5200] hover:bg-[#fc5200]/90 focus:ring-4 focus:ring-[#fc5200]/50 font-medium focus:outline-none px-5 py-2.5 rounded-lg dark:focus:ring-[#fc5200]/50 dark:hover:bg-[#fc5200]/30"
          >
            refreshToken
          </button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { AppToken } from "@prisma/client";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const createdFrom: Ref<string | null> = ref(null);
const interval: Ref<NodeJS.Timer | null> = ref(null);
const diffActivities = reactive({
  count: 0,
  hasMore: false,
});
const stravaSession: Ref<AppToken | null> = ref(null);

onBeforeMount(async () => {
  const response = await $fetch("/api/strava/auth/session", {
    method: "GET",
  });

  stravaSession.value = response.session;
  if (stravaSession.value) {
    createdFrom.value = dayjs(stravaSession.value.createdAt).fromNow();
    interval.value = setInterval(() => {
      if (stravaSession.value) {
        createdFrom.value = dayjs(stravaSession.value.createdAt).fromNow();
      }
    }, 1000 * 60); // 1 minute
    const { count, hasMore }: { count: number; hasMore: boolean } =
      await getDiffActivities();
    diffActivities.count = count;
    diffActivities.hasMore = hasMore;
  }
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});

const connectToStrava = async () => {
  const cookie = useCookie("redirect", {
    maxAge: 5 * 60, // 5 minutes
  });
  cookie.value = useRoute().fullPath;
  navigateTo("/strava/authorize");
};
const disconnectToStrava = async () => {
  await $fetch("/api/strava/auth/deauthorize", {
    method: "POST",
  });
  if (interval.value) {
    clearInterval(interval.value);
  }
  stravaSession.value = null;
};
const synchronizeActivities = async () => {
  const res = await $fetch("/api/strava/activity/synchronize", {
    method: "POST",
  });
  diffActivities.count = 0;
  diffActivities.hasMore = false;
};
const getDiffActivities = async () => {
  return await $fetch<{ count: number; data: string[]; hasMore: boolean }>(
    "/api/strava/activity/diff",
    {
      method: "GET",
      query: {
        max: 10,
      },
    }
  );
};
const refreshToken = async () => {
  const res = await $fetch("/api/strava/auth/refresh-token", {
    method: "POST",
  });
  console.log(res);
};
</script>
