<template>
  <div>
    <div v-for="reader in readers" :key="reader._id" class="publisher-item" @click="handleSelect(reader)" :class="{ active: selected && selected._id === reader._id }">
      <strong>{{ reader.HoTen }}</strong
      ><br />
      {{ reader.DiaChi }}<br />
      {{ reader.SoDienThoai }}
    </div>

    <div v-if="readers.length === 0" class="empty-state">Không có người dùng</div>
  </div>
</template>

<script>
import ReaderService from "../services/reader.service";

export default {
  emits: ["select-reader"],

  data() {
    return {
      readers: [],
      selected: null,
    };
  },

  async mounted() {
    await this.getAllReaders();
  },

  methods: {
    async getAllReaders() {
      this.readers = await ReaderService.getAll();
    },

    handleSelect(reader) {
      this.selected = reader;
      this.$emit("select-reader", reader);
    },
  },
};
</script>

<style>
@import "../assets/css/publisher.css";
@import "../assets/css/book.css";
</style>
