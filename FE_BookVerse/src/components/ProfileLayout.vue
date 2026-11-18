<template>
  <div class="profile-page">
    <ProfileSidebar :user="user" :activeTab="activeTab" :allowPassword="allowPassword" @changeTab="activeTab = $event" />

    <div class="profile-content">
      <div class="profile-title">Thông Tin</div>
      <ProfileView v-if="activeTab === 'profile'" :user="user" />

      <!-- RQ-10: Đổi mật khẩu -->
      <ChangePassword v-else-if="activeTab === 'password' && allowPassword" :userId="String(user._id)" @changed="handlePasswordChanged" />

      <ProfileEdit v-else :form="form" :allowAvatar="allowAvatar" @submit="handleUpdate" />
    </div>
  </div>
</template>

<style src="../assets/css/profile.css"></style>

<script>
import ProfileSidebar from "./ProfileSidebar.vue";
import ProfileView from "./ProfileView.vue";
import ProfileEdit from "./ProfileEdit.vue";
import ChangePassword from "./ChangePassword.vue";

export default {
  components: { ProfileSidebar, ProfileView, ProfileEdit, ChangePassword },

  props: {
    user: Object,
    // Các chức năng chỉ dành cho độc giả (RQ-09, RQ-10); trang hồ sơ nhân viên truyền false
    allowAvatar: { type: Boolean, default: true },
    allowPassword: { type: Boolean, default: true },
  },

  data() {
    return {
      activeTab: "profile",
      form: {},
    };
  },

  watch: {
    user: {
      immediate: true,
      handler(val) {
        this.form = { ...val };
      },
    },
  },

  methods: {
    handleUpdate(data) {
      this.$emit("updateUser", data);
      this.activeTab = "profile";
    },

    // RQ-10: tải lại dữ liệu người dùng để form chỉnh sửa không giữ mật khẩu cũ
    handlePasswordChanged() {
      this.$emit("reloadUser");
      this.activeTab = "profile";
    },
  },
};
</script>
