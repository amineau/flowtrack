<template>
  <el-row class="mb-4">
    <el-button
      v-show="status !== 'authenticated'"
      type="primary"
      round
      @click="signIn('strava')"
      >Login</el-button
    >
    <UserAvatar
      v-if="status === 'authenticated'"
      :user="data?.user"
      :size="40"
    />
    <el-button
      v-show="status === 'authenticated'"
      type="danger"
      round
      @click="signOut()"
      >Logout</el-button
    >
  </el-row>
</template>
<script lang="ts" setup>
const { status, data, signIn, signOut } = useAuth();
console.log({ status: status.value, data: data.value });
</script>

<style></style>
