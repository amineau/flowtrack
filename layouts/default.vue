<template>
  <div class="dark">
    <div
      class="w-screen min-h-screen bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col"
    >
      <Header />
      <div class="max-w-screen-lg mx-auto grow">
        <slot />
      </div>
      <Footer />
    </div>
  </div>
</template>
<script setup></script>
