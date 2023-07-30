<template>
  <div class="dark:bg-slate-950">
    <Navbar :user="data?.user" />
    <Sidebar v-if="status === 'authenticated'" />

    <div class="p-4 sm:ml-64 min-h-screen">
      <div
        class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { initDropdowns } from "flowbite";

const { data, status } = useAuth();

onMounted(() => {
  initDropdowns();
});
</script>
