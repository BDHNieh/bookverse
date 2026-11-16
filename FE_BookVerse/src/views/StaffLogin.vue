<script setup>
import LoginForm from "../components/LoginForm.vue";
import StaffService from "../services/staff.service";
import { useRouter } from "vue-router";
import bgImage from "../assets/image/bg.png";

const router = useRouter();

const handleLogin = async (data) => {
  try {
    const result = await StaffService.login(data);

    if (!result?.token) {
      alert("Login failed");
      return;
    }

    const user = {
      _id: result.user._id,
      Username: result.user.Username,
      token: result.token,
      role: "staff",
    };

    localStorage.setItem("user", JSON.stringify(user));

    router.push({ name: "AdminHome" });
  } catch (err) {
    alert("Login error");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
    <LoginForm role="staff" @submit:login="handleLogin" />
  </div>
</template>
