<script setup>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

const emit = defineEmits(["submit:login"]);

// Schema validate
const schema = yup.object({
  Username: yup.string().min(8, "Tên đăng nhập phải có ít nhất 8 ký tự").required("Tên đăng nhập không được để trống"),

  Password: yup.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").required("Mật khẩu không được để trống"),

  remember: yup.boolean(),
});

// Khi form hợp lệ
const handleSubmit = (values) => {
  emit("submit:login", values);
};

const props = defineProps({
  role: {
    type: String,
    default: "user",
  },
});
</script>

<template>
  <div class="staffLogin backdrop-blur-xl bg-white/20 shadow-2xl p-8">
    <div class="p-8 text-white bg-auto inside-form">
      <h2 class="text-4xl font-bold text-center mb-3">{{ $props.role === "staff" ? "Staff Login" : "Login" }}</h2>

      <Form :validation-schema="schema" @submit="handleSubmit" class="space-y-5">
        <div>
          <div class="flex items-center bg-white/30 rounded-xl px-4 focus-within:ring-2 focus-within:ring-white">
            <Field name="Username" type="text" placeholder="Username" class="flex-1 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none" />
            <font-awesome-icon icon="user" class="text-white/70" />
          </div>

          <ErrorMessage name="Username" class="text-red-300 text-sm block min-h-5" />
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center bg-white/30 rounded-xl px-4">
            <Field autocomplete="off" name="Password" type="password" placeholder="Password" class="flex-1 py-3 bg-transparent placeholder-white/70 text-white focus:outline-none" />

            <font-awesome-icon icon="lock" class="text-white/70" />
          </div>

          <!-- Error -->
          <ErrorMessage name="Password" class="text-red-300 text-sm block min-h-5" />
        </div>

        <!-- Remember -->
        <div class="flex justify-between items-center text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <Field name="remember" type="checkbox" class="accent-white" />
            Remember Me
          </label>

          <a href="#" class="hover:underline">Forgot Password?</a>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-4 gap-3">
          <div class="social-btn">
            <font-awesome-icon :icon="['fab', 'google']" />
          </div>

          <div class="social-btn">
            <font-awesome-icon :icon="['fab', 'facebook']" />
          </div>

          <div class="social-btn">
            <!-- Twitter mới là X -->
            <font-awesome-icon :icon="['fab', 'x-twitter']" />
          </div>

          <div class="social-btn">
            <font-awesome-icon :icon="['fab', 'github']" />
          </div>
        </div>

        <!-- Button -->
        <button type="submit" class="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-purple-100 transition">Login</button>

        <!-- Register -->
        <p v-if="props.role !== 'staff'" class="text-center text-sm ask-role">
          Don't have an account?
          <router-link to="/register" class="font-semibold hover:underline text-white"> Register </router-link>
        </p>

        <p class="text-center text-sm ask-role">
          {{ props.role === "staff" ? "Are you a user?" : "Are you a staff member?" }}
          <router-link :to="props.role === 'staff' ? '/login' : '/staff/login'" class="font-semibold hover:underline">
            {{ props.role === "staff" ? "Login as user" : "Login as staff" }}
          </router-link>
        </p>
      </Form>
    </div>
  </div>
</template>

<style>
.inside-form {
  margin-top: -20px;
}
.staffLogin {
  min-width: 460px;
  height: 510px;
  border-radius: 30px;
}

.ask-role {
  margin-top: -15px;
}

.social-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55px;
  width: 65px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: 0.3s;
  font-size: 18px;
  color: white;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.35);
}
</style>
