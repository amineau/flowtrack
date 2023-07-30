<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const props = defineProps({
  options: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["intersect"]);
const root = ref(null);
const observer = ref(null);
onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit("intersect");
    }
  }, props.options);
  observer.value.observe(root.value);
});
onUnmounted(() => {
  observer.value.disconnect();
});
</script>

<template>
  <div ref="root" />
</template>
