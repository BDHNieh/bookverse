<template>
  <HeaderAdmin />

  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content reveal-content">
        <h1 class="tittle">Reader</h1>
      </div>
    </div>
  </section>

  <div class="publisher-wrapper">
    <div class="publisher-card">
      <!-- LEFT -->
      <div class="publisher-left">
        <div class="publisher-header">
          <h4 class="title">Danh sách người dùng</h4>
        </div>

        <ReaderList ref="readerList" @select-reader="handleSelect" />
      </div>

      <!-- RIGHT -->
      <div class="publisher-right">
        <ReaderDetails v-if="selected" :reader="selected" @save="updateReader" @delete="deleteReader" />

        <div v-else class="empty-state">👉 Chọn người dùng để xem chi tiết</div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<script>
import HeaderAdmin from "../components/HeaderAdmin.vue";
import Footer from "../components/Footer.vue";
import ReaderList from "../components/ReaderList.vue";
import ReaderDetails from "../components/ReaderDetails.vue";
import ReaderService from "../services/reader.service";

export default {
  components: {
    ReaderList,
    ReaderDetails,
    Footer,
    HeaderAdmin,
  },

  data() {
    return {
      selected: null,
    };
  },

  methods: {
    handleSelect(reader) {
      this.selected = reader;
    },

    async updateReader(data) {
      await ReaderService.update(data._id, data);

      alert("Cập nhật thành công!");

      // 🔥 reload lại list
      this.$refs.readerList.getAllReaders();

      this.selected = data;
    },

    async deleteReader(id) {
      if (!confirm("Bạn có chắc muốn xóa?")) return;

      await ReaderService.delete(id);

      alert("Đã xóa!");

      this.$refs.readerList.getAllReaders();

      this.selected = null;
    },
  },
};
</script>

<style>
@import "../assets/css/publisher.css";
@import "../assets/css/book.css";
</style>
