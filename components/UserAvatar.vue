<template>
  <div class="el-menu-item">
    <el-avatar
      class="avatar"
      :size="40"
      :src="user.image"
      :alt="user.name"
    ></el-avatar
    >Antoine
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

<style scoped>
.avatar {
  margin-right: 10px;
}
</style>
