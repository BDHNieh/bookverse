<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="widform max-w-md backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-8 text-white text-center flex flex-col justify-center items-center">
    <!-- Oops -->
    <h1 class="text-8xl font-bold mb-6">Oops!</h1>

    <!-- 404 -->
    <h1 class="text-2xl font-bold">404</h1>

    <!-- Title -->
    <h2 class="text-2xl font-semibold">Page Not Found</h2>

    <!-- Description -->
    <p class="text-white/80 text-sm mt-2 leading-relaxed">
      The page you are looking for might have been removed <br />
      had its name changed or is temporarily unavailable.
    </p>
  </div>
</template>

<style>
.widform {
  margin: auto;
  min-width: 480px;
  height: 460px;
}
</style>
