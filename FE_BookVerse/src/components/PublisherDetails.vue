<template>
  <div class="publisher-details">
    <!-- HEADER -->
    <div class="details-header">
      <h3 class="title">Chi tiết NXB</h3>
    </div>

    <!-- CARD INFO -->
    <div class="details-card">
      <h2 class="title" v-if="!isEditing">{{ publisher.TenNXB }}</h2>
      <input v-else v-model="editablePublisher.TenNXB" class="form-control" />
    </div>

    <!-- ADDRESS -->
    <div class="details-box">
      <h4>ĐỊA CHỈ LIÊN HỆ</h4>
      <h2 v-if="!isEditing">{{ publisher.DiaChi }}</h2>
      <input v-else v-model="editablePublisher.DiaChi" class="form-control" />
    </div>

    <!-- PHONE -->
    <div class="details-box">
      <h4>SỐ ĐIỆN THOẠI</h4>
      <p v-if="!isEditing">{{ publisher.SDT }}</p>
      <input v-else v-model="editablePublisher.SDT" class="form-control" />
    </div>

    <div class="details-actions">
      <button v-if="!isEditing && isStaff" class="btn" @click="startEdit">Sửa</button>

      <template v-if="isEditing && isStaff">
        <button class="btn btn-primary" @click="saveEdit">Lưu</button>
        <button class="btn btn-secondary" @click="cancelEdit">Hủy</button>
      </template>

      <button v-if="isStaff" class="btn btn-delete" @click="deletePublisher">🗑 Xóa</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["publisher"],

  data() {
    return {
      isEditing: false,
      editablePublisher: {},
    };
  },

  watch: {
    publisher: {
      handler(newVal) {
        this.editablePublisher = { ...newVal };
      },
      immediate: true,
    },
  },

  methods: {
    startEdit() {
      this.isEditing = true;
      this.editablePublisher = { ...this.publisher };
    },

    saveEdit() {
      this.$emit("save", this.editablePublisher);
      this.isEditing = false;
    },

    cancelEdit() {
      this.isEditing = false;
    },

    deletePublisher() {
      if (confirm("Bạn có chắc muốn xóa NXB này?")) {
        this.$emit("delete", this.publisher._id);
      }
    },
  },

  props: {
    publisher: Object,
    isStaff: Boolean,
  },
};
</script>

<style scoped>
@import "../assets/css/publisher.css";
@import "../assets/css/book.css";
</style>
