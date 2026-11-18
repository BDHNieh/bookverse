<script setup>
import RegisterForm from "../components/RegisterForm.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import bgImage from "../assets/image/bg.png";

const router = useRouter();

const handleRegister = async (formData) => {
  try {
    await axios.post("http://localhost:3000/api/reader", formData, {
      skipAuth: true,
    });
    alert("Đăng ký thành công");
    router.push("/login");
  } catch (error) {
    // RQ-04: hiển thị đúng thông báo lỗi từ Backend (VD: Username already exists, Email already exists)
    const message = error.response?.data?.message;
    alert(message ? `Đăng ký thất bại: ${message}` : "Đăng ký thất bại");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-cover bg-center" :style="{ backgroundImage: `url(${bgImage})` }">
    <div>
      <RegisterForm @submit="handleRegister" />
    </div>
  </div>
</template>
