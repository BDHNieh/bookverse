<template>
  <div class="profile-page">
    <ProfileSidebar :user="user" :activeTab="activeTab" @changeTab="activeTab = $event" />

    <div class="profile-content">
      <div class="profile-title">Profile</div>
      <ProfileView v-if="activeTab === 'profile'" :user="user" />

      <ProfileEdit v-else :form="form" @submit="handleUpdate" />
    </div>
  </div>
</template>

<style src="../assets/css/profile.css"></style>

<script>
import ProfileSidebar from "./ProfileSidebar.vue";
import ProfileView from "./ProfileView.vue";
import ProfileEdit from "./ProfileEdit.vue";

export default {
  components: { ProfileSidebar, ProfileView, ProfileEdit },

  props: {
    user: Object,
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
  },
};
</script>
