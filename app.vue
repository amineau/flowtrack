<template>
  <div class="dark">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
  </div>
</template>
