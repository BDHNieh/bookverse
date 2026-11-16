<script setup>
import FooterComp from "../components/Footer.vue";
import BookDetail from "../components/BookDetail.vue";
import HeaderUser from "../components/HeaderUser.vue";
</script>

<template>
  <HeaderUser />
  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content reveal-content">
        <h1 class="tittle">Book Detail</h1>
      </div>
    </div>
  </section>
  <BookDetail />
  <FooterComp />
</template>

<style>
@import "../assets/css/book.css";
</style>
