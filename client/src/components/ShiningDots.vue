<template>
  <div class="shining-dots" :style="shiningDotsStyle">
    <div
      v-for="(dot, index) in dotCount"
      :key="index"
      class="dot"
      :style="getDotStyle(index)"
    ></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "yellow",
  },
  shineColor: {
    type: String,
    default: "yellow",
  },
  borderColor: {
    type: String,
    default: "black",
  },
  borderWidth: {
    type: Number,
    default: 20,
  },
  count: {
    type: Number,
    default: 12,
  },
  size: {
    type: Number,
    default: 10,
  },
});

const dotCount = computed(() => props.count);
const dotColor = computed(() => props.color);
const dotSize = computed(() => props.size);
const shiningDotsStyle = computed(() => ({
  border: `solid ${Math.round(props.borderWidth / 2)}px ${props.borderColor}`,
  padding: `${Math.round(props.borderWidth / 2)}px`,
  backgroundColor: props.borderColor,
  "--shine-color": props.shineColor,
}));

const getDotStyle = (index) => {
  const angle = (index / dotCount.value) * 2 * Math.PI;
  const radius = 50; // Set radius to 50%
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  const animationDelay = `${Math.random() * 1000}ms`; // Random delay between 0 and 1s

  return {
    backgroundColor: dotColor.value,
    left: `${x}%`,
    top: `${y}%`,
    width: `${dotSize.value}px`,
    height: `${dotSize.value}px`,
    animationDelay: animationDelay,
  };
};
</script>

<style scoped>
.shining-dots {
  border-radius: 50%;
  position: relative;
  margin: 50px auto; /* Center the circle */
}

.dot {
  border-radius: 50%;
  position: absolute;
  z-index: 1;
  box-shadow: 0 0 5px var(--shine-color), 0 0 10px var(--shine-color);
  animation: shine 0.5s infinite alternate;
  transform: translate(-50%, -50%);
  will-change: transform, box-shadow, opacity;
}

@keyframes shine {
  0% {
    box-shadow: 0 0 5px var(--shine-color), 0 0 10px var(--shine-color);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 15px var(--shine-color), 0 0 30px var(--shine-color);
    opacity: 0.5;
  }
}
</style>
