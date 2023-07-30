<template></template>
<script setup>
const { signOut } = useAuth();

signOut({
  callbackUrl: "/",
});
</script>
