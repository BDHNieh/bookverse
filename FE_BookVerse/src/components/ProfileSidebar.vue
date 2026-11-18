<template>
  <div class="profile-sidebar">
    <img class="profile-sidebar__avatar" :src="avatarSrc" alt="Ảnh đại diện" />

    <!-- TÊN -->
    <div class="profile-sidebar__name">
      {{ user.HoTen || user.HoTenNV || "User" }}
    </div>

    <!-- ROLE -->
    <div class="profile-sidebar__role">
      {{ roleText }}
    </div>

    <button :class="['profile-sidebar__btn', activeTab === 'profile' && 'profile-sidebar__btn--active']" @click="$emit('changeTab', 'profile')">Thông Tin</button>

    <button :class="['profile-sidebar__btn', activeTab === 'edit' && 'profile-sidebar__btn--active']" @click="$emit('changeTab', 'edit')">Chỉnh Sửa Thông Tin</button>

    <!-- RQ-10: Đổi mật khẩu -->
    <button v-if="allowPassword" :class="['profile-sidebar__btn', activeTab === 'password' && 'profile-sidebar__btn--active']" @click="$emit('changeTab', 'password')">Đổi mật khẩu</button>

    <div v-if="user" :class="['profile-sidebar__status', user.TrangThaiThe === 'locked' ? 'profile-sidebar__status--locked' : 'profile-sidebar__status--active']">
      {{ user.TrangThaiThe === "locked" ? "Bị khóa - không thể mượn sách" : "Hoạt động" }}
    </div>
  </div>
</template>

<script>
import defaultAvatar from "../assets/image/avt.jpg";
import { getAvatarUrl } from "../utils/avatar.utils";

export default {
  props: {
    user: Object,
    activeTab: String,
    allowPassword: { type: Boolean, default: true },
  },

  data() {
    return {
      defaultAvatar,
    };
  },

  computed: {
    // RQ-09: đọc ảnh đại diện từ dữ liệu mới nhất của server
    avatarSrc() {
      return getAvatarUrl(this.user?.Avatar, this.defaultAvatar);
    },

    roleText() {
      if (!this.user) return "";

      if (this.user.role === "staff") return "Quản lý";
      if (this.user.role === "user") return "Độc giả";
      return "User";
    },
  },
};
</script>

<style>
@import "../assets/css/profile.css";
</style>
