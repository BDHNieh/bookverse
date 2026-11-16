<template>
  <HeaderUser />
  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content reveal-content">
        <h1 class="tittle">Publisher</h1>
      </div>
    </div>
  </section>

  <div class="publisher-wrapper">
    <div class="publisher-card">
      <!-- LEFT -->
      <div class="publisher-left">
        <div class="publisher-header">
          <h4 class="title">Danh sách NXB</h4>
        </div>

        <PublisherList :publishers="publishers" @select-publisher="selected = $event" />
      </div>

      <!-- RIGHT -->
      <div class="publisher-right">
        <div v-if="selected">
          <PublisherDetails :publisher="selected" :isStaff="false" />
        </div>

        <div v-else class="empty-state">
          <p>👉 Chọn một NXB để xem chi tiết</p>
        </div>
      </div>
    </div>
  </div>

  <FooterComp />
</template>

<script>
import HeaderUser from "../components/HeaderUser.vue";
import FooterComp from "../components/Footer.vue";
import PublisherList from "../components/PublisherList.vue";
import PublisherDetails from "../components/PublisherDetails.vue";
import PublisherService from "../services/publisher.service";

export default {
  components: {
    PublisherList,
    PublisherDetails,
    HeaderUser,
    FooterComp,
  },

  data() {
    return {
      publishers: [],
      selected: null,
    };
  },

  async mounted() {
    this.publishers = await PublisherService.getAll();
  },
};
</script>

<style>
@import "../assets/css/book.css";
@import "../assets/css/publisher.css";
</style>
