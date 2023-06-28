<template>
  <MapActivities
    v-if="boundingBox && center && activities"
    :activities="activities"
    :center="center"
    :boundingBox="boundingBox"
  />
  <MenuActivities v-if="activities" :activities="activities" />
</template>

<script lang="ts" setup>
const activities = ref(null);
const center = ref(null);
const boundingBox = ref(null);

onBeforeMount(async () => {
  activities.value = await $fetch("/api/activity");
  const ids = activities.value?.map((a) => a.id);
  const centroid = await $fetch(`/api/activity/centroid?ids=${ids}`);
  center.value = centroid.centroid.coordinates;
  boundingBox.value = centroid.boundingBox.coordinates;
});
</script>
