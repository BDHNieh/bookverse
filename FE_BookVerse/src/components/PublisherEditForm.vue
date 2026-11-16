<template>
  <div class="publisher-details">
    <!-- HEADER -->
    <div class="details-header">
      <h3 class="title">Thêm / Chỉnh sửa NXB</h3>
    </div>
    <div v-if="isStaff">
      <Form :key="publisher?._id || 'new'" :validation-schema="schema" :initial-values="publisher" @submit="saveChanges">
        <!-- CARD -->
        <div class="details-card">
          <Field name="TenNXB" class="form-input title-input" placeholder="Tên NXB" />
          <ErrorMessage name="TenNXB" class="text-danger" />
        </div>

        <!-- ADDRESS -->
        <div class="details-box">
          <h4>ĐỊA CHỈ LIÊN HỆ</h4>
          <Field name="DiaChi" class="form-input" placeholder="Nhập địa chỉ..." />
          <ErrorMessage name="DiaChi" class="text-danger" />
        </div>

        <!-- PHONE -->
        <div class="details-box">
          <h4>SỐ ĐIỆN THOẠI</h4>
          <Field name="SDT" class="form-input" placeholder="Nhập SĐT..." />
          <ErrorMessage name="SDT" class="text-danger" />
        </div>

        <!-- ACTION -->
        <div class="details-actions">
          <button type="submit" class="btn btn-primary">Lưu</button>
          <button type="button" @click="$emit('cancel-edit')" class="btn btn-secondary">Hủy</button>
        </div>
      </Form>
    </div>
    <div v-else>
      <p>Bạn không có quyền chỉnh sửa</p>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  props: ["publisher"],
  emits: ["save-changes", "cancel-edit"],
  components: { Form, Field, ErrorMessage },

  data() {
    return {
      localPublisher: { ...this.publisher },
      schema: yup.object({
        TenNXB: yup.string().required(),
        DiaChi: yup.string().required(),
        SDT: yup.string().required(),
      }),
    };
  },

  methods: {
    saveChanges(values) {
      this.$emit("save-changes", {
        ...this.publisher,
        ...values,
      });
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
