<template>
  <div>
    <HeatMap
      :activities="activities"
      @setSelectedActivity="setSelectedActivity"
    />
    <div>
      <div class="max-w-screen-lg mx-auto flex flex-row justify-between">
        <div class="flex flex-row">
          <SingleDataCard
            label="date"
            :value="
              selectedActivity?.startDate &&
              useTransform().toFormattedDate(selectedActivity.startDate)
            "
          />
          <SingleDataCard
            label="distance"
            :value="
              selectedActivity?.distance &&
              useTransform().toKm(selectedActivity.distance)
            "
            unit="km"
          />
          <SingleDataCard
            label="average speed"
            :value="
              selectedActivity?.averageSpeed &&
              useTransform().toKmPerHour(selectedActivity.averageSpeed)
            "
            unit="km/h"
          />
          <SingleDataCard
            label="moving time"
            :value="
              selectedActivity?.movingTime &&
              useTransform().toFormattedDuration(selectedActivity.movingTime)
            "
          />
          <SingleDataCard
            label="elevation"
            :value="
              selectedActivity?.totalElevationGain &&
              useTransform().round(selectedActivity.totalElevationGain)
            "
            unit="m"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Activity } from "@prisma/client";
const selectedActivity = ref<Activity | null>(null);
const setSelectedActivity = (activity: Activity) => {
  selectedActivity.value = activity;
};
const { data } = await useFetch("/api/activity");

const activities: Ref<Activity[]> = data;
</script>
