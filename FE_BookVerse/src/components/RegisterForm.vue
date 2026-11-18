<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const emit = defineEmits(["submit"]);

const schema = yup.object({
  Username: yup.string().min(6, "Username must be at least 6 characters").max(20, "Username must be at most 20 characters").required("Please enter Username"),

  Password: yup.string().min(8, "Password must be at least 8 characters").required("Please enter password"),

  Email: yup.string().email("Invalid email format").required("Please enter email"),

  SoDienThoai: yup
    .string()
    .matches(/^\d{10,11}$/, "Phone number must be 10-11 digits")
    .required("Please enter phone number"),
});

const handleSubmit = (values) => {
  emit("submit", values);
};
</script>

<template>
  <div class="w-96 max-w-lg backdrop-blur-xl bg-white/20 rounded-2xl shadow-2xl p-8 text-white">
    <h2 class="text-3xl font-bold text-center mb-6">Register</h2>

    <Form :validation-schema="schema" @submit="handleSubmit" class="space-y-5">
      <!-- Username -->
      <div class="relative">
        <Field
          name="Username"
          type="text"
          placeholder="Username"
          class="w-full px-4 pr-12 py-3 rounded-xl bg-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        <font-awesome-icon icon="user" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
        <ErrorMessage name="Username" class="text-red-300 text-sm mt-1" />
      </div>

      <!-- Password -->
      <div class="relative">
        <Field
          name="Password"
          type="password"
          placeholder="Password"
          class="w-full px-4 pr-12 py-3 rounded-xl bg-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        <font-awesome-icon icon="lock" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
        <ErrorMessage name="Password" class="text-red-300 text-sm mt-1" />
      </div>

      <!-- Email -->
      <div class="relative">
        <Field name="Email" type="email" placeholder="Email" class="w-full px-4 pr-12 py-3 rounded-xl bg-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white" />
        <font-awesome-icon icon="envelope" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
        <ErrorMessage name="Email" class="text-red-300 text-sm mt-1" />
      </div>

      <!-- Phone -->
      <div class="relative">
        <Field
          name="SoDienThoai"
          type="text"
          placeholder="Phone Number"
          class="w-full px-4 pr-12 py-3 rounded-xl bg-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
        <font-awesome-icon icon="phone" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
        <ErrorMessage name="SoDienThoai" class="text-red-300 text-sm mt-1" />
      </div>

      <button type="submit" class="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-purple-100 transition">Register</button>

      <p class="text-center text-sm mt-4">
        Already have an account?
        <router-link to="/login" class="font-semibold hover:underline"> Login </router-link>
      </p>
    </Form>
  </div>
</template>
