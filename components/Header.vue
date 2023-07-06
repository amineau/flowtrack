<template>
  <div
    class="border-b bg-slate-100 border-slate-200 dark:border-slate-600 dark:bg-slate-700"
  >
    <div class="max-w-screen-lg mx-auto flex justify-between py-4">
      <div class="">
        <a href="#" class="items-center"
          ><span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >Cyfrak</span
          ></a
        >
      </div>
      <div v-if="status == 'authenticated'" class="" id="navbar-dropdown">
        <ul class="font-medium flex flex-row items-center space-x-4">
          <li>
            <a href="#" class="py-2 px-4 hover:text-blue-400">Dashboard</a>
          </li>
          <li>
            <a href="#" class="py-2 px-4 hover:text-blue-400">Workouts</a>
          </li>
          <li>
            <a href="#" class="py-2 px-4 hover:text-blue-400">Routes</a>
          </li>
          <li>
            <button
              id="dropdownNavbarLink"
              data-dropdown-toggle="dropdownNavbar"
              type="button"
              class="flex flex-row items-center px-4 space-x-2 hover:text-blue-400"
            >
              <img
                class="w-8 h-8 rounded-full"
                :src="data.user.image"
                :alt="data.user.name"
              />
              <span>{{ data?.user.name }}</span>
            </button>

            <div
              id="dropdownNavbar"
              class="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                class="py-2 text-sm text-gray-700 dark:text-gray-400"
                aria-labelledby="dropdownLargeButton"
              >
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >Profil</a
                  >
                </li>
                <li>
                  <a
                    href="#"
                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >Settings</a
                  >
                </li>
              </ul>
              <div class="py-1">
                <button
                  @click="signOut()"
                  class="block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="">
        <button
          @click="signIn('strava')"
          type="button"
          class="flex justify-center items-center text-sm text-white bg-[#fc5200] hover:bg-[#fc5200]/90 focus:ring-4 focus:ring-[#fc5200]/50 font-medium focus:outline-none px-5 py-2.5 rounded-lg dark:focus:ring-[#fc5200]/50 dark:hover:bg-[#fc5200]/30"
        >
          <svg
            class="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.731 0 2 9.125h2.788L6.73 5.497l1.93 3.628h2.766L6.731 0zm4.694 9.125-1.372 2.756L8.66 9.125H6.547L10.053 16l3.484-6.875h-2.112z"
            />
          </svg>
          Sign in with Strava
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { initDropdowns } from "flowbite";

onMounted(() => {
  initDropdowns();
});
const { status, data, signIn, signOut } = useAuth();
</script>

<style></style>
