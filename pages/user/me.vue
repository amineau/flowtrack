// frontend/pages/user/Me.vue
<template>
  <div class="max-w-md w-full mx-auto mt-8">
    <h1 class="text-3xl font-extrabold mb-4">Your profile</h1>
    <form @submit.prevent="userUpdate">
      <div class="mb-6">
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Your email</label
        >
        <input
          type="email"
          class="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :value="user.email"
        />
      </div>
      <div class="mb-6">
        <label
          for="username"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Your username</label
        >
        <input
          type="text"
          class="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :value="user.username"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg"
      >
        Update
      </button>
    </form>
  </div>
</template>
<script setup>
// const user = useStrapiUser();
// const client = useStrapiClient();
const { data } = useAuth();
const user = ref(data.value.user);

const userUpdate = async () => {
  try {
    await client("/users/me", {
      method: "PUT",
      params: user.value,
    });
  } catch (error) {
    console.log(error);
  }
};
</script>
