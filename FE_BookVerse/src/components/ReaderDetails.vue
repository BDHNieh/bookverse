<template>
  <div v-if="reader" class="publisher-details">
    <!-- HEADER -->
    <div class="details-header">
      <h3 class="title">Chi tiết người dùng</h3>
    </div>

    <!-- CARD -->
    <div class="details-card">
      <h2 class="title" v-if="!isEditing">{{ reader.HoTen }}</h2>
      <input v-else v-model="editable.HoTen" class="form-input title-input" />
    </div>

    <!-- USERNAME -->
    <div class="details-box">
      <h4>USERNAME</h4>
      <p v-if="!isEditing">{{ reader.Username }}</p>
      <input v-else v-model="editable.Username" class="form-input" />
    </div>

    <!-- ADDRESS -->
    <div class="details-box">
      <h4>ĐỊA CHỈ</h4>
      <p v-if="!isEditing">{{ reader.DiaChi }}</p>
      <input v-else v-model="editable.DiaChi" class="form-input" />
    </div>

    <!-- PHONE -->
    <div class="details-box">
      <h4>SỐ ĐIỆN THOẠI</h4>
      <p v-if="!isEditing">{{ reader.SoDienThoai }}</p>
      <input v-else v-model="editable.SoDienThoai" class="form-input" />
    </div>

    <!-- STATUS -->
    <div class="details-box">
      <h4>TRẠNG THÁI</h4>
      <p v-if="!isEditing">{{ reader.TrangThaiThe }}</p>

      <select v-else v-model="editable.TrangThaiThe" class="form-input">
        <option value="active">Active</option>
        <option value="locked">Locked</option>
      </select>
    </div>

    <!-- ACTION -->
    <div class="details-actions">
      <button v-if="!isEditing" class="btn" @click="startEdit">Sửa</button>

      <template v-if="isEditing">
        <button class="btn btn-primary" @click="save">Lưu</button>
        <button class="btn btn-secondary" @click="cancel">Hủy</button>
      </template>

      <button class="btn btn-delete" @click="remove">🗑 Xóa</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reader: Object,
  },

  data() {
    return {
      isEditing: false, // ✅ FIX 1
      editable: {},
    };
  },

  watch: {
    reader: {
      immediate: true,
      handler(val) {
        if (val) {
          this.editable = { ...val };
        }
      },
    },
  },

  methods: {
    startEdit() {
      this.isEditing = true;
    },

    save() {
      this.$emit("save", this.editable);
      this.isEditing = false;
    },

    cancel() {
      this.isEditing = false;
      this.editable = { ...this.reader };
    },

    remove() {
      this.$emit("delete", this.reader._id);
    },
  },
};
</script>

<style>
@import "../assets/css/publisher.css";
@import "../assets/css/book.css";
</style>
