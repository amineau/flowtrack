<template>
  <el-avatar :src="user.image" />
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
