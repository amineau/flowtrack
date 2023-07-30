<template>
  <button
    type="button"
    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800"
    @click="importActivityFile"
  >
    Import an activity
  </button>
</template>
<script setup lang="ts">
const importActivityFile = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".fit";
  input.onchange = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    await $fetch("/api/activity/import", {
      method: "POST",
      body: formData,
    });
  };
  input.click();
};
</script>
