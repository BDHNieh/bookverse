<script setup>
import { ref, computed } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

// Lấy book từ props
const props = defineProps({
  book: { type: Object, required: true },
});

const emit = defineEmits(["close", "confirm"]);
const loading = ref(false);

const currentUser = JSON.parse(localStorage.getItem("user")) || {};

// Ngày mượn
const borrowData = ref({
  NgayMuon: new Date().toISOString().slice(0, 10),
  NgayTra: "",
});

// Số ngày mượn
const borrowDuration = ref(7);

const schema = yup.object({
  borrowDuration: yup.number().required("Vui lòng nhập số ngày mượn").min(1, "Ít nhất 1 ngày").max(30, "Tối đa 30 ngày"),
});

// Tính ngày trả
const calculatedReturnDate = computed(() => {
  if (!borrowDuration.value) return "...";
  const date = new Date(borrowData.value.NgayMuon);
  date.setDate(date.getDate() + parseInt(borrowDuration.value));
  return date.toLocaleDateString("vi-VN");
});

const calculatedReturnDateRaw = computed(() => {
  if (!borrowDuration.value) return null;
  const date = new Date(borrowData.value.NgayMuon);
  date.setDate(date.getDate() + parseInt(borrowDuration.value));
  return date;
});

// Submit form
const submitBorrow = () => {
  // check book
  if (!props.book || !props.book._id) {
    alert("Không tìm thấy sách!");
    return;
  }

  // check user
  if (!currentUser || !currentUser._id) {
    alert("Bạn chưa đăng nhập!");
    return;
  }

  // check ngày trả
  if (!calculatedReturnDateRaw.value) {
    alert("Ngày trả không hợp lệ!");
    return;
  }

  const muonDate = new Date();
  loading.value = true;
  const payload = {
    MaSach: props.book._id,
    MaDocGia: currentUser._id,
    NgayMuon: muonDate,
    NgayTra: calculatedReturnDateRaw.value,
    TrangThai: "Đang mượn",
  };

  emit("confirm", payload);
  emit("close");
};
</script>

<template>
  <div class="borrow-form-backdrop">
    <div class="borrow-form-content">
      <h3 class="borrow-header">Mượn sách: {{ props.book.TenSach }}</h3>

      <Form @submit="submitBorrow" :validation-schema="schema">
        <div class="form-group">
          <label>Ngày mượn</label>
          <Field name="NgayMuon" type="date" class="form-control" v-model="borrowData.NgayMuon" readonly />
        </div>

        <div class="form-group">
          <label>Số ngày mượn</label>
          <Field name="borrowDuration" type="number" class="form-control" v-model="borrowDuration" :min="1" :max="30" />
          <ErrorMessage name="borrowDuration" class="text-danger mt-1" />
          <div class="text-success mt-1">Hạn trả: {{ calculatedReturnDate }}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-light" @click="$emit('close')">Hủy</button>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? "Đang gửi..." : "Xác nhận" }}
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style>
@import "../assets/css/book.css";
</style>
