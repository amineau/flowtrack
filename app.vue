<template>
  <div>
    <NuxtLayout>
      <!-- <NuxtLoadingIndicator /> -->
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
  </div>
</template>
