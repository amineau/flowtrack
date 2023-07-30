<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  unit?: string;
}>();
</script>
<template>
  <div
    class="w-40 h-20 flex flex-col bg-slate-100 border-slate-200 dark:bg-grey-800 border dark:border-grey-700 justify-center items-center"
  >
    <div class="text-xl font-bold capitalize">{{ label }}</div>
    <div class="text-sm">
      {{ value || "---" }} <span v-if="unit">{{ unit }}</span>
    </div>
  </div>
</template>
