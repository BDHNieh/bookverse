<script setup>
import HeaderUser from "../components/HeaderUser.vue";
import FooterComp from "../components/Footer.vue";
import BookBorrowList from "../components/BorrowList.vue";
import BookBorrowService from "../services/borrow.service";
import { getUserData } from "../utils/auth.utils";
import { ref, onMounted } from "vue";
const normalize = (s) => s?.trim().toLowerCase();

const bookBorrows = ref([]);
const currentUser = JSON.parse(localStorage.getItem("user") || "null");

const fetchBorrows = async () => {
  try {
    const all = await BookBorrowService.getAll();

    if (!currentUser?._id) {
      console.error("User không tồn tại");
      return;
    }

    bookBorrows.value = all.filter((b) => b && b.MaDocGia && String(b.MaDocGia) === String(currentUser._id));
  } catch (error) {
    console.error(error);
  }
};

const handleCancel = async (item) => {
  if (!confirm("Bạn có chắc muốn hủy yêu cầu này?")) return;

  try {
    await BookBorrowService.update(item._id, {
      TrangThai: "Đã hủy",
    });

    alert("Đã hủy thành công!");
    await fetchBorrows();
  } catch (error) {
    alert("Lỗi: " + error.message);
  }
};

onMounted(fetchBorrows);
</script>

<template>
  <HeaderUser />
  <section class="reveal reveal-section">
    <div class="container_reveal">
      <div class="reveal__content reveal-content">
        <h1 class="tittle">Borrow</h1>
      </div>
    </div>
  </section>
  <div class="m-auto" style="max-width: 1200px">
    <BookBorrowList :borrows="bookBorrows" :role="currentUser?.role">
      <template #actions="{ item }">
        <button v-if="normalize(item.TrangThai) === 'chờ duyệt'" @click="handleCancel(item)" class="cancel-button-borrow">Hủy</button>

        <span v-else-if="normalize(item.TrangThai) === 'đang mượn'"> Đang mượn </span>

        <span v-else-if="normalize(item.TrangThai) === 'đã trả'"> Hoàn tất </span>

        <span v-else-if="normalize(item.TrangThai) === 'đã hủy'"> Đã hủy </span>

        <span v-else-if="normalize(item.TrangThai) === 'đã từ chối'"> Bị từ chối </span>
      </template>
    </BookBorrowList>
  </div>

  <FooterComp />
</template>

<style>
@import "../assets/css/book.css";
</style>
