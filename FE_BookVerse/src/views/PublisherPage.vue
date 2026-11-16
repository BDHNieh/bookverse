<template>
  <HeaderAdmin />
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
          <button class="btn-add" @click="showAddForm = true">+ Thêm</button>
        </div>

        <PublisherList :publishers="publishers" @select-publisher="selected = $event" />
      </div>

      <!-- RIGHT -->
      <div class="publisher-right">
        <div v-if="showAddForm">
          <PublisherEditForm :publisher="newPublisher" :isStaff="isStaff" @save-changes="handleSave" @cancel-edit="handleCancel" />
        </div>

        <div v-else-if="selected">
          <PublisherDetails :publisher="selected" :isStaff="isStaff" @save="updatePublisher" @delete="deletePublisher" />
        </div>

        <div v-else class="empty-state">
          <p>👉 Chọn một NXB để xem chi tiết</p>
        </div>
      </div>
    </div>
  </div>
  <FooterComp />
</template>

<style>
@import "../assets/css/book.css";
@import "../assets/css/publisher.css";
</style>

<script>
import HeaderAdmin from "../components/HeaderAdmin.vue";
import FooterComp from "../components/Footer.vue";
import PublisherList from "../components/PublisherList.vue";
import PublisherDetails from "../components/PublisherDetails.vue";
import PublisherEditForm from "../components/PublisherEditForm.vue";
import PublisherService from "../services/publisher.service";

export default {
  components: { PublisherList, PublisherDetails, HeaderAdmin, FooterComp, PublisherEditForm },

  data() {
    return {
      publishers: [],
      selected: null,
      showAddForm: false,
      newPublisher: {
        TenNXB: "",
        DiaChi: "",
        SDT: "",
      },
    };
  },

  async mounted() {
    this.publishers = await PublisherService.getAll();
  },

  methods: {
    async updatePublisher(data) {
      const user = JSON.parse(localStorage.getItem("user"));

      await PublisherService.api.put(`/${data._id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const index = this.publishers.findIndex((p) => p._id === data._id);
      if (index !== -1) {
        this.publishers[index] = data;
      }

      this.publishers = [...this.publishers];
      this.selected = data;
    },

    async createPublisher(data) {
      const user = JSON.parse(localStorage.getItem("user"));

      await PublisherService.api.post(`/`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Thêm thành công!");

      this.showAddForm = false;

      this.newPublisher = {
        TenNXB: "",
        DiaChi: "",
        SDT: "",
      };

      this.publishers = await PublisherService.getAll();
    },

    async handleSave(data) {
      if (this.showAddForm) {
        await this.createPublisher(data);
      } else {
        await this.updatePublisher(data);
      }
    },

    handleCancel() {
      this.showAddForm = false;
      this.selected = null;
    },

    async deletePublisher(id) {
      const user = JSON.parse(localStorage.getItem("user"));

      await PublisherService.api.delete(`/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      this.publishers = this.publishers.filter((p) => p._id !== id);
      this.selected = null;
    },
  },

  computed: {
    isStaff() {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.role === "staff";
    },
  },
};
</script>
