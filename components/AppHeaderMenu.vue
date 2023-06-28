<template>
  <div class="card flex flex-row align-content-start flex-wrap">
    <SplitButton
      :model="items"
      icon="pi pi-plus"
      class="bg-primary border-round"
    >
      <Button class="">
        <UserAvatar :user="user" />
        <span class="vertical-align-baseline font-bold">{{ user.name }}</span>
      </Button>
    </SplitButton>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const { signOut } = useAuth();

const items = [
  {
    label: "Sign Out",
    icon: "pi pi-sign-out",
    command: () => signOut(),
  },
];
</script>

<style scoped></style>
