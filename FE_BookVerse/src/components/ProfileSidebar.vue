<template>
  <div class="profile-sidebar">
    <img class="profile-sidebar__avatar" :src="user.avatar || defaultAvatar" />

    <!-- TÊN -->
    <div class="profile-sidebar__name">
      {{ user.HoTen || user.HoTenNV || "User" }}
    </div>

    <!-- ROLE -->
    <div class="profile-sidebar__role">
      {{ roleText }}
    </div>

    <button :class="['profile-sidebar__btn', activeTab === 'profile' && 'profile-sidebar__btn--active']" @click="$emit('changeTab', 'profile')">Profile</button>

    <button :class="['profile-sidebar__btn', activeTab === 'edit' && 'profile-sidebar__btn--active']" @click="$emit('changeTab', 'edit')">Edit Profile</button>

    <div v-if="user" :class="['profile-sidebar__status', user.TrangThaiThe === 'locked' ? 'profile-sidebar__status--locked' : 'profile-sidebar__status--active']">
      {{ user.TrangThaiThe === "locked" ? "Bị khóa - không thể mượn sách" : "Hoạt động" }}
    </div>
  </div>
</template>

<script>
import defaultAvatar from "../assets/image/avt.jpg";

export default {
  props: ["user", "activeTab"],

  data() {
    return {
      defaultAvatar,
    };
  },

  computed: {
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
