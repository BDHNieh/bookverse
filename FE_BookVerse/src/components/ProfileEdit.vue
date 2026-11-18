<template>
  <div class="profile-edit">
    <h3>Chỉnh sửa thông tin</h3>

    <form @submit.prevent="submit">
      <!-- RQ-09: Ảnh đại diện -->
      <div v-if="allowAvatar" class="profile-edit__group profile-edit__avatar-group">
        <img class="profile-edit__avatar-preview" :src="avatarPreview" alt="Ảnh đại diện" />
        <input ref="avatarInput" type="file" accept="image/jpeg,image/png" style="display: none" @change="handleAvatarChange" />
        <button type="button" class="profile-edit__btn" :disabled="isUploadingAvatar" @click="$refs.avatarInput.click()">
          {{ isUploadingAvatar ? "Đang tải ảnh..." : "Đổi ảnh đại diện" }}
        </button>
        <small class="profile-edit__hint">Chấp nhận JPG/PNG, tối đa 5MB. Ảnh sẽ được áp dụng sau khi nhấn "Lưu".</small>
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.HoTen" placeholder="Họ tên" />
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.Email" placeholder="Email" />
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.DiaChi" placeholder="Địa chỉ" />
      </div>

      <div class="profile-edit__group">
        <input class="profile-edit__input" v-model="localForm.SoDienThoai" placeholder="SĐT" />
      </div>

      <button type="submit" class="profile-edit__btn">Lưu</button>
    </form>
  </div>
</template>

<script>
import ReaderService from "../services/reader.service";
import defaultAvatar from "../assets/image/avt.jpg";
import { getAvatarUrl } from "../utils/avatar.utils";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // NFR-05: tối đa 5MB

export default {
  props: {
    form: Object,
    // Chỉ độc giả mới có chức năng đổi ảnh đại diện (RQ-09)
    allowAvatar: { type: Boolean, default: true },
  },

  data() {
    return {
      localForm: {},
      isSubmitting: false,
      isUploadingAvatar: false,
    };
  },

  computed: {
    avatarPreview() {
      return getAvatarUrl(this.localForm.Avatar, defaultAvatar);
    },
  },

  watch: {
    form: {
      immediate: true,
      handler(val) {
        this.localForm = { ...val };
      },
    },
  },

  methods: {
    // RQ-09: kiểm tra định dạng/dung lượng ở Frontend rồi tải lên máy chủ
    async handleAvatarChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Chỉ chấp nhận ảnh JPG hoặc PNG");
        e.target.value = "";
        return;
      }
      if (file.size > MAX_AVATAR_SIZE) {
        alert("Ảnh không được vượt quá 5MB");
        e.target.value = "";
        return;
      }

      this.isUploadingAvatar = true;
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        const result = await ReaderService.uploadAvatar(formData);
        this.localForm.Avatar = result.filename;
      } catch (error) {
        alert(error.response?.data?.message || "Tải ảnh lên thất bại");
      } finally {
        this.isUploadingAvatar = false;
        e.target.value = "";
      }
    },

    submit(e) {
      if (e) e.preventDefault();

      if (this.isSubmitting) return;

      this.isSubmitting = true;

      this.$emit("submit", this.localForm);

      setTimeout(() => {
        this.isSubmitting = false;
      }, 500);
    },
  },
};
</script>
