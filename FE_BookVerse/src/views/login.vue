<script setup>
import LoginForm from "../components/LoginForm.vue";
import ReaderService from "../services/reader.service";
import { useRouter } from "vue-router";
import bgImage from "../assets/image/bg.png";

const router = useRouter();

const handleLogin = async (data) => {
  try {
    const result = await ReaderService.login(data);

    if (!result?.token) {
      alert("Login failed. Please check your credentials.");
      return;
    }

    if (result.user && result.token) {
      const userData = {
        ...result.user,
        token: result.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    // Chuyển trang sau login
    router.push({ name: "Home" });
    // hoặc router.push("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Login error.");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
    <LoginForm role="user" @submit:login="handleLogin" />
  </div>
</template>
