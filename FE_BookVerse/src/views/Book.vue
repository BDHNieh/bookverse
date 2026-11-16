<script setup lang="ts">
import HeaderUser from "../components/HeaderUser.vue";
import FooterComp from "../components/Footer.vue";
import BookList from "../components/BookList.vue";
</script>

<template>
  <HeaderUser />
  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content">
        <h1 class="tittle">Book</h1>
      </div>
    </div>
  </section>
  <BookList />
  <FooterComp />
</template>

<style>
@import "../assets/css/book.css";
</style>
