<script setup>
import NotFound from "../components/NotFound.vue";
import bgImage from "../assets/image/bg.png";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
    <NotFound />
  </div>
</template>
