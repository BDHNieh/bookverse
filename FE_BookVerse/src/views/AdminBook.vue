<script setup>
import HeaderAdmin from "../components/HeaderAdmin.vue";
import FooterComp from "../components/Footer.vue";
import AdminBookList from "../components/AdminBookList.vue";
</script>

<template>
  <HeaderAdmin />
  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content reveal-content">
        <h1 class="tittle">Admin Book</h1>
      </div>
    </div>
  </section>
  <div class="m-auto" style="max-width: 1200px">
    <AdminBookList />
  </div>
  <FooterComp />
</template>

<style>
@import "../assets/css/book.css";
</style>
