<template>
  <MapActivity v-if="activity" :activity="activity" />
</template>

<script setup>
const route = useRoute();

const id = ref(route.params.id);

let activity = ref(null);

onBeforeMount(async () => {
  try {
    const res = await $fetch(`/api/activity/${id.value}`);
    activity.value = res;
  } catch (err) {
    console.log(err);
  }
});
</script>

<style></style>
