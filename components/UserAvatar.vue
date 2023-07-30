<template>
  <div
    class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-900"
  >
    <span class="font-medium text-gray-600 dark:text-gray-300">{{
      user.username.slice(0, 2).toUpperCase()
    }}</span>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>
