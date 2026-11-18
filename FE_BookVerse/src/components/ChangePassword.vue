<script setup>
// RQ-10: Đổi mật khẩu - kiểm tra dữ liệu bằng vee-validate + yup (đồng nhất với RegisterForm/LoginForm)
import { ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import ReaderService from "../services/reader.service";

const props = defineProps({
  userId: { type: String, required: true },
});
const emit = defineEmits(["changed"]);

const isSubmitting = ref(false);

const schema = yup.object({
  OldPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),

  NewPassword: yup
    .string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .required("Vui lòng nhập mật khẩu mới")
    .notOneOf([yup.ref("OldPassword")], "Mật khẩu mới phải khác mật khẩu hiện tại"),

  ConfirmPassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu mới")
    .oneOf([yup.ref("NewPassword")], "Mật khẩu nhập lại không khớp"),
});

const handleSubmit = async (values, { resetForm }) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await ReaderService.changePassword(props.userId, {
      OldPassword: values.OldPassword,
      NewPassword: values.NewPassword,
    });
    alert("Đổi mật khẩu thành công");
    resetForm();
    emit("changed");
  } catch (error) {
    // Hiển thị thông báo từ Backend (VD: mật khẩu hiện tại không đúng)
    const message = error.response?.data?.message;
    alert(message ? `Đổi mật khẩu thất bại: ${message}` : "Đổi mật khẩu thất bại");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="profile-edit">
    <h3>Đổi mật khẩu</h3>

    <Form :validation-schema="schema" @submit="handleSubmit">
      <div class="profile-edit__group">
        <Field name="OldPassword" type="password" autocomplete="current-password" class="profile-edit__input" placeholder="Mật khẩu hiện tại" />
        <ErrorMessage name="OldPassword" class="profile-edit__error" />
      </div>

      <div class="profile-edit__group">
        <Field name="NewPassword" type="password" autocomplete="new-password" class="profile-edit__input" placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" />
        <ErrorMessage name="NewPassword" class="profile-edit__error" />
      </div>

      <div class="profile-edit__group">
        <Field name="ConfirmPassword" type="password" autocomplete="new-password" class="profile-edit__input" placeholder="Nhập lại mật khẩu mới" />
        <ErrorMessage name="ConfirmPassword" class="profile-edit__error" />
      </div>

      <button type="submit" class="profile-edit__btn" :disabled="isSubmitting">
        {{ isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu" }}
      </button>
    </Form>
  </div>
</template>
